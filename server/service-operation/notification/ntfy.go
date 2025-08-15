
package notification

import (
	"fmt"
	"net/http"
	"strings"
)

// NtfyService handles NTFY push notifications
type NtfyService struct{}

// NewNtfyService creates a new NTFY notification service
func NewNtfyService() *NtfyService {
	return &NtfyService{}
}

// SendNotification sends a notification via NTFY
func (ns *NtfyService) SendNotification(config *AlertConfiguration, message string) error {
	if config.NtfyEndpoint == "" {
		return fmt.Errorf("ntfy endpoint is required")
	}

	// Create HTTP request with plain text message
	req, err := http.NewRequest("POST", config.NtfyEndpoint, strings.NewReader(message))
	if err != nil {
		return fmt.Errorf("failed to create NTFY request: %v", err)
	}

	// Set headers for NTFY
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")
	req.Header.Set("Title", "🔔 CheckCle Service Alert")
	req.Header.Set("Tags", "monitoring")
	req.Header.Set("Priority", "default")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send NTFY notification: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("ntfy API error, status: %d", resp.StatusCode)
	}

	return nil
}

// SendServerNotification sends a server-specific notification via NTFY
func (ns *NtfyService) SendServerNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) error {
	message := ns.generateServerMessage(payload, template, resourceType)
	return ns.SendNotificationWithDetails(config, message, "🔔 Server Alert", resourceType)
}

// SendServiceNotification sends a service-specific notification via NTFY
func (ns *NtfyService) SendServiceNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServiceNotificationTemplate) error {
	message := ns.generateServiceMessage(payload, template)
	return ns.SendNotificationWithDetails(config, message, "🔔 Service Alert", "service")
}

// SendNotificationWithDetails sends a notification with custom title and tags
func (ns *NtfyService) SendNotificationWithDetails(config *AlertConfiguration, message, title, alertType string) error {
	if config.NtfyEndpoint == "" {
		return fmt.Errorf("ntfy endpoint is required")
	}

	// Create HTTP request with plain text message
	req, err := http.NewRequest("POST", config.NtfyEndpoint, strings.NewReader(message))
	if err != nil {
		return fmt.Errorf("failed to create NTFY request: %v", err)
	}

	// Set headers for NTFY with dynamic values
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")
	req.Header.Set("Title", title)
	
	// Set appropriate tags and priority based on alert type and message content
	tags := "monitoring"
	priority := "default"
	
	// Determine priority and tags based on message content
	messageLower := strings.ToLower(message)
	if strings.Contains(messageLower, "down") || strings.Contains(messageLower, "critical") || strings.Contains(messageLower, "expired") {
		priority = "high"
		tags = "rotating_light,warning"
	} else if strings.Contains(messageLower, "warning") || strings.Contains(messageLower, "expiring") {
		priority = "default"
		tags = "warning"
	} else if strings.Contains(messageLower, "up") || strings.Contains(messageLower, "restored") || strings.Contains(messageLower, "resolved") {
		priority = "default"
		tags = "white_check_mark"
	}
	
	// Add resource type specific tags
	switch alertType {
	case "cpu":
		tags += ",cpu"
	case "ram", "memory":
		tags += ",memory"
	case "disk":
		tags += ",floppy_disk"
	case "network":
		tags += ",globe_with_meridians"
	case "service":
		tags += ",gear"
	case "ssl":
		tags += ",lock"
	}
	
	req.Header.Set("Tags", tags)
	req.Header.Set("Priority", priority)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send NTFY notification: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("ntfy API error, status: %d", resp.StatusCode)
	}

	return nil
}

// generateServerMessage creates a message for server notifications using server template
func (ns *NtfyService) generateServerMessage(payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) string {
	var templateMessage string
	
	// Select appropriate template message based on status and resource type
	switch strings.ToLower(payload.Status) {
	case "down":
		templateMessage = template.DownMessage
	case "up":
		templateMessage = template.UpMessage
	case "warning":
		templateMessage = template.WarningMessage
	case "paused":
		templateMessage = template.PausedMessage
	default:
		// Handle resource-specific messages
		switch resourceType {
		case "cpu":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreCPUMessage
			} else {
				templateMessage = template.CPUMessage
			}
		case "ram", "memory":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreRAMMessage
			} else {
				templateMessage = template.RAMMessage
			}
		case "disk":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreDiskMessage
			} else {
				templateMessage = template.DiskMessage
			}
		case "network":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreNetworkMessage
			} else {
				templateMessage = template.NetworkMessage
			}
		case "cpu_temp", "cpu_temperature":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreCPUTempMessage
			} else {
				templateMessage = template.CPUTempMessage
			}
		case "disk_io":
			if strings.Contains(strings.ToLower(payload.Status), "restore") {
				templateMessage = template.RestoreDiskIOMessage
			} else {
				templateMessage = template.DiskIOMessage
			}
		default:
			templateMessage = template.WarningMessage
		}
	}
	
	// If no template message found, use a default
	if templateMessage == "" {
		templateMessage = ns.generateDefaultServerMessage(payload, resourceType)
	}
	
	return ns.replacePlaceholders(templateMessage, payload)
}

// generateServiceMessage creates a message for service notifications using service template
func (ns *NtfyService) generateServiceMessage(payload *NotificationPayload, template *ServiceNotificationTemplate) string {
	var templateMessage string
	
	// Select appropriate template message based on status
	switch strings.ToLower(payload.Status) {
	case "up":
		templateMessage = template.UpMessage
	case "down":
		templateMessage = template.DownMessage
	case "maintenance":
		templateMessage = template.MaintenanceMessage
	case "incident":
		templateMessage = template.IncidentMessage
	case "resolved":
		templateMessage = template.ResolvedMessage
	case "warning":
		templateMessage = template.WarningMessage
	default:
		templateMessage = template.WarningMessage
	}
	
	// If no template message found, use a default
	if templateMessage == "" {
		templateMessage = ns.generateDefaultUptimeMessage(payload)
	}
	
	return ns.replacePlaceholders(templateMessage, payload)
}

// replacePlaceholders replaces all placeholders in the message with actual values
func (ns *NtfyService) replacePlaceholders(message string, payload *NotificationPayload) string {
	// Replace basic placeholders
	message = strings.ReplaceAll(message, "${service_name}", payload.ServiceName)
	message = strings.ReplaceAll(message, "${status}", strings.ToUpper(payload.Status))
	message = strings.ReplaceAll(message, "${host}", ns.safeString(payload.Host))
	message = strings.ReplaceAll(message, "${hostname}", ns.safeString(payload.Hostname))
	
	// Replace URL with fallback to host
	url := ns.safeString(payload.URL)
	if url == "N/A" && payload.Host != "" {
		url = payload.Host
	}
	message = strings.ReplaceAll(message, "${url}", url)
	
	// Replace domain
	message = strings.ReplaceAll(message, "${domain}", ns.safeString(payload.Domain))
	
	// Replace service type
	if payload.ServiceType != "" {
		message = strings.ReplaceAll(message, "${service_type}", strings.ToUpper(payload.ServiceType))
	} else {
		message = strings.ReplaceAll(message, "${service_type}", "N/A")
	}
	
	// Replace region and agent info
	message = strings.ReplaceAll(message, "${region_name}", ns.safeString(payload.RegionName))
	message = strings.ReplaceAll(message, "${agent_id}", ns.safeString(payload.AgentID))
	
	// Handle numeric fields safely
	if payload.Port > 0 {
		message = strings.ReplaceAll(message, "${port}", fmt.Sprintf("%d", payload.Port))
	} else {
		message = strings.ReplaceAll(message, "${port}", "N/A")
	}
	
	if payload.ResponseTime > 0 {
		message = strings.ReplaceAll(message, "${response_time}", fmt.Sprintf("%dms", payload.ResponseTime))
	} else {
		message = strings.ReplaceAll(message, "${response_time}", "N/A")
	}
	
	if payload.Uptime > 0 {
		message = strings.ReplaceAll(message, "${uptime}", fmt.Sprintf("%d%%", payload.Uptime))
	} else {
		message = strings.ReplaceAll(message, "${uptime}", "N/A")
	}
	
	// Replace server monitoring fields
	message = strings.ReplaceAll(message, "${cpu_usage}", ns.safeString(payload.CPUUsage))
	message = strings.ReplaceAll(message, "${ram_usage}", ns.safeString(payload.RAMUsage))
	message = strings.ReplaceAll(message, "${disk_usage}", ns.safeString(payload.DiskUsage))
	message = strings.ReplaceAll(message, "${network_usage}", ns.safeString(payload.NetworkUsage))
	message = strings.ReplaceAll(message, "${cpu_temp}", ns.safeString(payload.CPUTemp))
	message = strings.ReplaceAll(message, "${disk_io}", ns.safeString(payload.DiskIO))
	message = strings.ReplaceAll(message, "${threshold}", ns.safeString(payload.Threshold))
	
	// Replace error message - important for uptime services
	message = strings.ReplaceAll(message, "${error_message}", ns.safeString(payload.ErrorMessage))
	message = strings.ReplaceAll(message, "${error}", ns.safeString(payload.ErrorMessage))
	
	// Replace time placeholders
	message = strings.ReplaceAll(message, "${time}", payload.Timestamp.Format("2006-01-02 15:04:05"))
	message = strings.ReplaceAll(message, "${timestamp}", payload.Timestamp.Format("2006-01-02 15:04:05"))
	
	return message
}

// safeString returns the string value or "N/A" if empty
func (ns *NtfyService) safeString(value string) string {
	if value == "" {
		return "N/A"
	}
	return value
}

// generateDefaultUptimeMessage creates a default uptime message with proper formatting
func (ns *NtfyService) generateDefaultUptimeMessage(payload *NotificationPayload) string {
	// Status emoji mapping for NTFY
	statusEmoji := "🔵"
	switch strings.ToLower(payload.Status) {
	case "up":
		statusEmoji = "🟢"
	case "down":
		statusEmoji = "🔴"
	case "warning":
		statusEmoji = "🟡"
	case "maintenance", "paused":
		statusEmoji = "🟠"
	}
	
	message := fmt.Sprintf("%s Service %s is %s.", statusEmoji, payload.ServiceName, strings.ToUpper(payload.Status))
	
	// Build formatted details
	details := []string{}
	
	// Add URL or host
	if payload.URL != "" {
		details = append(details, fmt.Sprintf("Host URL: %s", payload.URL))
	} else if payload.Host != "" {
		details = append(details, fmt.Sprintf("Host: %s", payload.Host))
	}
	
	// Add service type
	if payload.ServiceType != "" {
		details = append(details, fmt.Sprintf("Type: %s", strings.ToUpper(payload.ServiceType)))
	}
	
	// Add port if available
	if payload.Port > 0 {
		details = append(details, fmt.Sprintf("Port: %d", payload.Port))
	}
	
	// Add domain if available
	if payload.Domain != "" {
		details = append(details, fmt.Sprintf("Domain: %s", payload.Domain))
	}
	
	// Add response time
	if payload.ResponseTime > 0 {
		details = append(details, fmt.Sprintf("Response time: %dms", payload.ResponseTime))
	} else {
		details = append(details, "Response time: N/A")
	}
	
	// Add region info
	if payload.RegionName != "" {
		details = append(details, fmt.Sprintf("Region: %s", payload.RegionName))
	}
	
	// Add agent info
	if payload.AgentID != "" {
		details = append(details, fmt.Sprintf("Agent: %s", payload.AgentID))
	}
	
	// Add uptime if available
	if payload.Uptime > 0 {
		details = append(details, fmt.Sprintf("Uptime: %d%%", payload.Uptime))
	}
	
	// Add timestamp
	details = append(details, fmt.Sprintf("Time: %s", payload.Timestamp.Format("2006-01-02 15:04:05")))
	
	// Combine message with details
	if len(details) > 0 {
		message += "\n" + strings.Join(details, "\n")
	}
	
	return message
}

// generateDefaultServerMessage creates a default server message
func (ns *NtfyService) generateDefaultServerMessage(payload *NotificationPayload, resourceType string) string {
	statusEmoji := "🔵"
	switch strings.ToLower(payload.Status) {
	case "up":
		statusEmoji = "🟢"
	case "down":
		statusEmoji = "🔴"
	case "warning":
		statusEmoji = "🟡"
	}
	
	return fmt.Sprintf("%s🖥️ Server %s (%s) status: %s", statusEmoji, payload.ServiceName, payload.Hostname, strings.ToUpper(payload.Status))
}