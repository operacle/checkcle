
package monitoring

import (
	"errors"
	"log"
	"strings"
	"time"

	"service-operation/operations"
	"service-operation/pocketbase"
	"service-operation/shared/savers"
	"service-operation/types"
)

const (
	// defaultCheckTimeout is the per-attempt timeout for a service check.
	defaultCheckTimeout = 10 * time.Second

	// defaultMaxRetries matches the UI default ("3 attempts") and the
	// legacy frontend checker behavior (service.max_retries || 3).
	defaultMaxRetries = 3

	// maxRetriesCap bounds user-provided values so one check cycle can
	// never block a service monitor loop for an excessive time.
	maxRetriesCap = 10

	// retryDelay is the pause between consecutive attempts.
	retryDelay = 2 * time.Second
)

// errUnsupportedServiceType marks service types the checker cannot handle.
var errUnsupportedServiceType = errors.New("unsupported service type")

func (ms *MonitoringService) performCheck(service pocketbase.Service) {
	// First, fetch the latest service status from PocketBase to ensure we have current data
	latestService, err := ms.pbClient.GetService(service.ID)
	if err != nil {
		log.Printf("Failed to fetch latest service status for %s: %v", service.Name, err)
		return
	}

	// Respect the service status - don't check paused services
	if latestService.Status == "paused" {
		return // Silently skip paused services
	}

	// Honor the per-service retry configuration (services.max_retries).
	// The service is only marked down after ALL attempts fail, so one
	// slow or dropped probe no longer flaps the service to "down".
	maxRetries := normalizeMaxRetries(latestService.MaxRetries)

	result, err := runCheckAttempts(latestService, maxRetries, defaultCheckTimeout, retryDelay)
	if errors.Is(err, errUnsupportedServiceType) {
		log.Printf("Unknown service type: %s for service %s", latestService.ServiceType, latestService.Name)
		return
	}

	// Determine status based on the final attempt
	status := "down"
	errorMessage := ""
	responseTime := int64(0)

	if err != nil {
		errorMessage = err.Error()
		log.Printf("❌ %s failed: %v", latestService.Name, err)
	} else if result != nil {
		responseTime = result.ResponseTime.Milliseconds()
		if result.Success {
			status = "up"
			//log.Printf("✅ %s: %.0fms", latestService.Name, float64(responseTime))
		} else {
			status = "down"
			errorMessage = result.Error
			log.Printf("❌ %s failed: %s", latestService.Name, errorMessage)
		}
	}

	// Only update service status if the service is not paused
	// Check one more time before updating to prevent race conditions
	currentService, err := ms.pbClient.GetService(latestService.ID)
	if err != nil {
		log.Printf("Failed to verify service status before update for %s: %v", latestService.Name, err)
		return
	}

	if currentService.Status == "paused" {
		return // Silently skip status update for paused services
	}

	// Update service status in PocketBase only if not paused
	if err := ms.pbClient.UpdateServiceStatus(latestService.ID, status, responseTime, errorMessage); err != nil {
		log.Printf("Failed to update service status for %s: %v", latestService.Name, err)
	}

	// Save metrics data with regional information
	if result != nil {
		regionName, agentID := ms.GetRegionalInfo()
		metricsSaver := savers.NewMetricsSaverWithRegion(ms.pbClient, regionName, agentID)
		metricsSaver.SaveMetricsForService(*latestService, result)
	}
}

// normalizeMaxRetries clamps the configured max_retries to a sane range,
// falling back to the default when the field is unset (0) or invalid.
func normalizeMaxRetries(configured int) int {
	if configured <= 0 {
		return defaultMaxRetries
	}
	if configured > maxRetriesCap {
		return maxRetriesCap
	}
	return configured
}

// runCheckAttempts executes up to maxRetries check attempts for the service,
// waiting delay between attempts. It returns as soon as one attempt succeeds;
// otherwise it returns the outcome of the final attempt.
func runCheckAttempts(service *pocketbase.Service, maxRetries int, timeout, delay time.Duration) (*types.OperationResult, error) {
	var result *types.OperationResult
	var err error

	for attempt := 1; attempt <= maxRetries; attempt++ {
		result, err = executeCheck(service, timeout)
		if errors.Is(err, errUnsupportedServiceType) {
			return nil, err
		}

		if err == nil && result != nil && result.Success {
			if attempt > 1 {
				log.Printf("✅ %s succeeded on attempt %d/%d", service.Name, attempt, maxRetries)
			}
			return result, nil
		}

		if attempt < maxRetries {
			log.Printf("⚠️ %s check failed (attempt %d/%d), retrying in %s", service.Name, attempt, maxRetries, delay)
			time.Sleep(delay)
		}
	}

	return result, err
}

// executeCheck runs a single check attempt for the service. It is a plain
// function (it needs no MonitoringService state) so tests can call it directly.
func executeCheck(service *pocketbase.Service, timeout time.Duration) (*types.OperationResult, error) {
	switch strings.ToLower(service.ServiceType) {
	case "ping", "icmp":
		pingOp := operations.NewPingOperation(timeout)
		host := service.Host
		if host == "" {
			host = service.URL
		}
		return pingOp.Execute(host, 1) // Single ping for monitoring

	case "dns":
		dnsOp := operations.NewDNSOperation(timeout)
		host := service.Host
		if host == "" {
			host = service.Domain
		}
		// Default to A record, but could be made configurable
		queryType := "A"
		return dnsOp.Execute(host, queryType)

	case "tcp":
		tcpOp := operations.NewTCPOperation(timeout)
		host := service.Host
		if host == "" {
			host = service.URL
		}
		port := service.Port
		if port <= 0 {
			port = 80 // Default port
		}
		return tcpOp.Execute(host, port)

	case "http", "https":
		httpOp := operations.NewHTTPOperation(timeout)
		url := service.URL
		if url == "" {
			url = service.Host
		}
		return httpOp.Execute(url, "GET")
	}

	return nil, errUnsupportedServiceType
}
