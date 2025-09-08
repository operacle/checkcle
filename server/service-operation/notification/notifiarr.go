package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// NotifiarrService handles Notifiarr notifications
type NotifiarrService struct{}

// NewNotifiarrService creates a new Notifiarr notification service
func NewNotifiarrService() *NotifiarrService {
	return &NotifiarrService{}
}

// NotifiarrPayload represents the payload for Notifiarr API
type NotifiarrPayload struct {
	Notification NotifiarrNotification `json:"notification"`
	Discord      NotifiarrDiscord      `json:"discord"`
}

type NotifiarrNotification struct {
	Update bool   `json:"update"`
	Name   string `json:"name"`
	Event  string `json:"event,omitempty"`
}

type NotifiarrDiscord struct {
	Color  string           `json:"color,omitempty"`
	Ping   NotifiarrPing    `json:"ping,omitempty"`
	Images NotifiarrImages  `json:"images,omitempty"`
	Text   NotifiarrText    `json:"text"`
	IDs    NotifiarrIDs     `json:"ids,omitempty"`
}

type NotifiarrPing struct {
	PingUser int64 `json:"pingUser,omitempty"`
	PingRole int64 `json:"pingRole,omitempty"`
}

type NotifiarrImages struct {
	Thumbnail string `json:"thumbnail,omitempty"`
	Image     string `json:"image,omitempty"`
}

type NotifiarrText struct {
	Title       string `json:"title"`
	Icon        string `json:"icon,omitempty"`
	Content     string `json:"content,omitempty"`
	Description string `json:"description"`
	Fields      []any  `json:"fields,omitempty"`
	Footer      string `json:"footer,omitempty"`
}

type NotifiarrIDs struct {
	Channel int64 `json:"channel,omitempty"`
}

// SendNotification sends a notification via Notifiarr
func (ns *NotifiarrService) SendNotification(config *AlertConfiguration, message string) error {
	// fmt.Printf("📡 [NOTIFIARR] Attempting to send notification...\n")
	// fmt.Printf("📡 [NOTIFIARR] Config - API Token present: %v\n", config.APIToken != "")
	// fmt.Printf("📡 [NOTIFIARR] Message: %s\n", message)

	if config.APIToken == "" {
		return fmt.Errorf("notifiarr API token is required")
	}

	// Parse channel ID if provided
	var channelID int64
	if config.ChannelID != "" {
		if parsed, err := strconv.ParseInt(config.ChannelID, 10, 64); err == nil {
			channelID = parsed
		}
	}

	url := fmt.Sprintf("https://notifiarr.com/api/v1/notification/passthrough/%s", config.APIToken)
	// fmt.Printf("📡 [NOTIFIARR] API URL: %s\n", strings.Replace(url, config.APIToken, "[REDACTED]", 1))

	// Create status-based color
	color := ns.getStatusColor(message)
	
	payload := NotifiarrPayload{
		Notification: NotifiarrNotification{
			Update: false,
			Name:   "This is an automated notification from CheckCle System",
			Event:  "",
		},
		Discord: NotifiarrDiscord{
			Color: color,
			Text: NotifiarrText{
				Title:       "Service Alert",
				Description: message,
				Footer:      "CheckCle Monitoring System",
			},
			IDs: NotifiarrIDs{
				Channel: channelID,
			},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	// fmt.Printf("📡 [NOTIFIARR] Sending POST request...\n")
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		// fmt.Printf("❌ [NOTIFIARR] HTTP error: %v\n", err)
		return err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		// fmt.Printf("❌ [NOTIFIARR] HTTP status error: %d\n", resp.StatusCode)
		return fmt.Errorf("notifiarr API error: status code %d", resp.StatusCode)
	}

	// fmt.Printf("✅ [NOTIFIARR] Message sent successfully!\n")
	return nil
}

// SendServerNotification sends a server-specific notification via Notifiarr
func (ns *NotifiarrService) SendServerNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) error {
	message := ns.generateServerMessage(payload, template, resourceType)
	return ns.SendNotification(config, message)
}

// SendServiceNotification sends a service-specific notification via Notifiarr
func (ns *NotifiarrService) SendServiceNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServiceNotificationTemplate) error {
	message := ns.generateServiceMessage(payload, template)
	return ns.SendNotification(config, message)
}

// generateServerMessage creates a message for server notifications using server template
func (ns *NotifiarrService) generateServerMessage(payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) string {
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
func (ns *NotifiarrService) generateServiceMessage(payload *NotificationPayload, template *ServiceNotificationTemplate) string {
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
func (ns *NotifiarrService) replacePlaceholders(message string, payload *NotificationPayload) string {
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
func (ns *NotifiarrService) safeString(value string) string {
	if value == "" {
		return "N/A"
	}
	return value
}

// getStatusColor returns appropriate color for status
func (ns *NotifiarrService) getStatusColor(message string) string {
	messageLower := strings.ToLower(message)
	
	if strings.Contains(messageLower, "down") || strings.Contains(messageLower, "error") || strings.Contains(messageLower, "failed") {
		return "FF0000" // Red
	} else if strings.Contains(messageLower, "up") || strings.Contains(messageLower, "restored") || strings.Contains(messageLower, "resolved") {
		return "00FF00" // Green
	} else if strings.Contains(messageLower, "warning") || strings.Contains(messageLower, "alert") {
		return "FFA500" // Orange
	}
	
	return "0099FF" // Blue (default)
}

// generateDefaultUptimeMessage creates a default uptime message with proper formatting
func (ns *NotifiarrService) generateDefaultUptimeMessage(payload *NotificationPayload) string {
	// Status emoji mapping
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
		details = append(details, fmt.Sprintf(" - Host URL: %s", payload.URL))
	} else if payload.Host != "" {
		details = append(details, fmt.Sprintf(" - Host: %s", payload.Host))
	}
	
	// Add service type
	if payload.ServiceType != "" {
		details = append(details, fmt.Sprintf(" - Type: %s", strings.ToUpper(payload.ServiceType)))
	}
	
	// Add port if available
	if payload.Port > 0 {
		details = append(details, fmt.Sprintf(" - Port: %d", payload.Port))
	}
	
	// Add domain if available
	if payload.Domain != "" {
		details = append(details, fmt.Sprintf(" - Domain: %s", payload.Domain))
	}
	
	// Add response time
	if payload.ResponseTime > 0 {
		details = append(details, fmt.Sprintf(" - Response time: %dms", payload.ResponseTime))
	} else {
		details = append(details, " - Response time: N/A")
	}
	
	// Add region info
	if payload.RegionName != "" {
		details = append(details, fmt.Sprintf(" - Region: %s", payload.RegionName))
	}
	
	// Add agent info
	if payload.AgentID != "" {
		details = append(details, fmt.Sprintf(" - Agent: %s", payload.AgentID))
	}
	
	// Add uptime if available
	if payload.Uptime > 0 {
		details = append(details, fmt.Sprintf(" - Uptime: %d%%", payload.Uptime))
	}
	
	// Add timestamp
	details = append(details, fmt.Sprintf(" - Time: %s", payload.Timestamp.Format("2006-01-02 15:04:05")))
	
	// Combine message with details
	if len(details) > 0 {
		message += "\n" + strings.Join(details, "\n")
	}
	
	return message
}

// generateDefaultServerMessage creates a default server message
func (ns *NotifiarrService) generateDefaultServerMessage(payload *NotificationPayload, resourceType string) string {
	statusEmoji := "🔵"
	switch strings.ToLower(payload.Status) {
	case "up":
		statusEmoji = "🟢"
	case "down":
		statusEmoji = "🔴"
	case "warning":
		statusEmoji = "🟡"
	}
	
	return fmt.Sprintf("%s 🖥️ Server %s (%s) status: %s", statusEmoji, payload.ServiceName, payload.Hostname, strings.ToUpper(payload.Status))
}