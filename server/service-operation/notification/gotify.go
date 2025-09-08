package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// GotifyService handles Gotify notifications
type GotifyService struct{}

// NewGotifyService creates a new Gotify notification service
func NewGotifyService() *GotifyService {
	return &GotifyService{}
}

// GotifyPayload represents the payload for Gotify API
type GotifyPayload struct {
	Message  string `json:"message"`
	Title    string `json:"title,omitempty"`
	Priority int    `json:"priority,omitempty"`
}

// GotifyResponse represents the response from Gotify API
type GotifyResponse struct {
	ID       int    `json:"id"`
	AppID    int    `json:"appid"`
	Message  string `json:"message"`
	Title    string `json:"title"`
	Priority int    `json:"priority"`
	Date     string `json:"date"`
}

// SendNotification sends a notification via Gotify
func (gs *GotifyService) SendNotification(config *AlertConfiguration, message string) error {
	// fmt.Printf("📱 [GOTIFY] Attempting to send notification...\n")
	// fmt.Printf("📱 [GOTIFY] Config - API Token: %s, Server URL: %s, Notify Name: %s\n", 
	//     maskToken(config.APIToken), config.ServerURL, config.NotifyName)
	// fmt.Printf("📱 [GOTIFY] Message: %s\n", message)

	if config.APIToken == "" || config.ServerURL == "" {
		return fmt.Errorf("Gotify API token and server URL are required")
	}

	// Prepare the payload
	payload := GotifyPayload{
		Message:  message,
		Title:    config.NotifyName, // Use notify_name as the title
		Priority: 5,                 // Default priority
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		// fmt.Printf("❌ [GOTIFY] JSON marshal error: %v\n", err)
		return err
	}

	// fmt.Printf("📱 [GOTIFY] Payload: %s\n", string(jsonData))
	// fmt.Printf("📱 [GOTIFY] Sending POST request to Gotify API...\n")

	// Construct the Gotify API URL
	apiURL := strings.TrimRight(config.ServerURL, "/") + "/message?token=" + config.APIToken

	// Send the request to Gotify API
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		// fmt.Printf("❌ [GOTIFY] HTTP error: %v\n", err)
		return err
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		// fmt.Printf("❌ [GOTIFY] HTTP status error: %d\n", resp.StatusCode)
		return fmt.Errorf("Gotify API error: HTTP %d", resp.StatusCode)
	}

	// Parse the response
	var gotifyResp GotifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&gotifyResp); err != nil {
		// fmt.Printf("❌ [GOTIFY] Response decode error: %v\n", err)
		return err
	}

	// fmt.Printf("📱 [GOTIFY] API response: %+v\n", gotifyResp)

	// Check if the message was created successfully
	if gotifyResp.ID == 0 {
		// fmt.Printf("❌ [GOTIFY] API error: No message ID returned\n")
		return fmt.Errorf("Gotify API error: message not created")
	}

	// fmt.Printf("✅ [GOTIFY] Message sent successfully! ID: %d\n", gotifyResp.ID)
	return nil
}

// SendServerNotification sends a server-specific notification via Gotify
func (gs *GotifyService) SendServerNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) error {
	message := gs.generateServerMessage(payload, template, resourceType)
	return gs.SendNotification(config, message)
}

// SendServiceNotification sends a service-specific notification via Gotify
func (gs *GotifyService) SendServiceNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServiceNotificationTemplate) error {
	message := gs.generateServiceMessage(payload, template)
	return gs.SendNotification(config, message)
}

// generateServerMessage creates a message for server notifications using server template
func (gs *GotifyService) generateServerMessage(payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) string {
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
		templateMessage = gs.generateDefaultServerMessage(payload, resourceType)
	}
	
	return gs.replacePlaceholders(templateMessage, payload)
}

// generateServiceMessage creates a message for service notifications using service template
func (gs *GotifyService) generateServiceMessage(payload *NotificationPayload, template *ServiceNotificationTemplate) string {
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
		templateMessage = gs.generateDefaultUptimeMessage(payload)
	}
	
	return gs.replacePlaceholders(templateMessage, payload)
}

// replacePlaceholders replaces all placeholders in the message with actual values
func (gs *GotifyService) replacePlaceholders(message string, payload *NotificationPayload) string {
	// Replace basic placeholders
	message = strings.ReplaceAll(message, "${service_name}", payload.ServiceName)
	message = strings.ReplaceAll(message, "${server_name}", payload.ServiceName) // server_name maps to service_name
	message = strings.ReplaceAll(message, "${status}", strings.ToUpper(payload.Status))
	message = strings.ReplaceAll(message, "${host}", gs.safeString(payload.Host))
	message = strings.ReplaceAll(message, "${hostname}", gs.safeString(payload.Hostname))
	
	// Replace URL with fallback to host
	url := gs.safeString(payload.URL)
	if url == "N/A" && payload.Host != "" {
		url = payload.Host
	}
	message = strings.ReplaceAll(message, "${url}", url)
	
	// Replace domain
	message = strings.ReplaceAll(message, "${domain}", gs.safeString(payload.Domain))
	
	// Replace service type
	if payload.ServiceType != "" {
		message = strings.ReplaceAll(message, "${service_type}", strings.ToUpper(payload.ServiceType))
	} else {
		message = strings.ReplaceAll(message, "${service_type}", "N/A")
	}
	
	// Replace region and agent info
	message = strings.ReplaceAll(message, "${region_name}", gs.safeString(payload.RegionName))
	message = strings.ReplaceAll(message, "${agent_id}", gs.safeString(payload.AgentID))
	
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
	message = strings.ReplaceAll(message, "${cpu_usage}", gs.safeString(payload.CPUUsage))
	message = strings.ReplaceAll(message, "${ram_usage}", gs.safeString(payload.RAMUsage))
	message = strings.ReplaceAll(message, "${disk_usage}", gs.safeString(payload.DiskUsage))
	message = strings.ReplaceAll(message, "${network_usage}", gs.safeString(payload.NetworkUsage))
	message = strings.ReplaceAll(message, "${cpu_temp}", gs.safeString(payload.CPUTemp))
	message = strings.ReplaceAll(message, "${disk_io}", gs.safeString(payload.DiskIO))
	message = strings.ReplaceAll(message, "${threshold}", gs.safeString(payload.Threshold))
	
	// Replace SSL certificate fields
	message = strings.ReplaceAll(message, "${certificate_name}", gs.safeString(payload.CertificateName))
	message = strings.ReplaceAll(message, "${expiry_date}", gs.safeString(payload.ExpiryDate))
	message = strings.ReplaceAll(message, "${days_left}", gs.safeString(payload.DaysLeft))
	message = strings.ReplaceAll(message, "${issuer_cn}", gs.safeString(payload.IssuerCN))
	message = strings.ReplaceAll(message, "${issuer}", gs.safeString(payload.IssuerCN)) // alias
	
	// Replace error message - important for uptime services
	message = strings.ReplaceAll(message, "${error_message}", gs.safeString(payload.ErrorMessage))
	message = strings.ReplaceAll(message, "${error}", gs.safeString(payload.ErrorMessage))
	message = strings.ReplaceAll(message, "${message}", gs.safeString(payload.Message))
	
	// Replace time placeholders
	message = strings.ReplaceAll(message, "${time}", payload.Timestamp.Format("2006-01-02 15:04:05"))
	message = strings.ReplaceAll(message, "${timestamp}", payload.Timestamp.Format("2006-01-02 15:04:05"))
	
	return message
}

// safeString returns the string value or "N/A" if empty
func (gs *GotifyService) safeString(value string) string {
	if value == "" {
		return "N/A"
	}
	return value
}

// generateDefaultUptimeMessage creates a default uptime message with proper formatting
func (gs *GotifyService) generateDefaultUptimeMessage(payload *NotificationPayload) string {
	message := fmt.Sprintf("Service %s is %s.", payload.ServiceName, strings.ToUpper(payload.Status))
	
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
func (gs *GotifyService) generateDefaultServerMessage(payload *NotificationPayload, resourceType string) string {
	return fmt.Sprintf("Server %s (%s) status: %s", payload.ServiceName, payload.Hostname, strings.ToUpper(payload.Status))
}