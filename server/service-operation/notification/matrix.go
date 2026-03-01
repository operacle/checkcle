package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// MatrixService handles Matrix chat notifications
type MatrixService struct{}

// NewMatrixService creates a new Matrix notification service
func NewMatrixService() *MatrixService {
	return &MatrixService{}
}

// matrixMessagePayload represents the payload for the Matrix Client-Server API
type matrixMessagePayload struct {
	MsgType       string `json:"msgtype"`
	Body          string `json:"body"`
	Format        string `json:"format,omitempty"`
	FormattedBody string `json:"formatted_body,omitempty"`
}

// SendNotification sends a formatted message to a Matrix room.
// It sends both a plain-text fallback body and an HTML formatted_body with
// severity-based colors so clients that support Matrix's custom HTML format
// display a rich, colored notification.
func (ms *MatrixService) SendNotification(config *AlertConfiguration, message string) error {
	if config.MatrixHomeserver == "" || config.MatrixRoomID == "" || config.MatrixAccessToken == "" {
		return fmt.Errorf("matrix homeserver, room ID and access token are required")
	}

	// Encode the room ID for use in the URL path
	encodedRoomID := url.PathEscape(config.MatrixRoomID)

	// Use Unix nanoseconds as a unique transaction ID to prevent duplicate messages
	txnID := fmt.Sprintf("%d", time.Now().UnixNano())

	apiURL := fmt.Sprintf("%s/_matrix/client/v3/rooms/%s/send/m.room.message/%s",
		strings.TrimRight(config.MatrixHomeserver, "/"),
		encodedRoomID,
		txnID,
	)

	payload := matrixMessagePayload{
		MsgType:       "m.text",
		Body:          message,
		Format:        "org.matrix.custom.html",
		FormattedBody: ms.buildHTMLBody(message),
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("matrix: failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPut, apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("matrix: failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+config.MatrixAccessToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("matrix: HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("matrix: API returned status %d", resp.StatusCode)
	}

	return nil
}

// buildHTMLBody converts a plain-text notification message into Matrix-compatible HTML.
// The first line becomes a colored bold heading based on alert severity; subsequent
// detail lines are rendered as a bullet list. Clients that don't support HTML fall
// back to the plain Body field.
func (ms *MatrixService) buildHTMLBody(plainText string) string {
	lines := strings.Split(strings.TrimSpace(plainText), "\n")
	if len(lines) == 0 {
		return "<p>" + html.EscapeString(plainText) + "</p>"
	}

	title := strings.TrimSpace(lines[0])
	color := ms.statusColor(title)

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("<p><strong><font color=%q>%s</font></strong></p>", color, html.EscapeString(title)))

	var items []string
	for _, line := range lines[1:] {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		// Strip leading bullet markers added by the plain-text generators
		line = strings.TrimPrefix(line, "•")
		line = strings.TrimPrefix(line, "-")
		line = strings.TrimSpace(line)
		if line != "" {
			items = append(items, "<li>"+html.EscapeString(line)+"</li>")
		}
	}

	if len(items) > 0 {
		sb.WriteString("<ul>")
		for _, item := range items {
			sb.WriteString(item)
		}
		sb.WriteString("</ul>")
	}

	sb.WriteString("<p><em>CheckCle System Alert</em></p>")
	return sb.String()
}

// statusColor returns an HTML hex color string that reflects the alert severity
// detected from keywords and emoji in the message heading.
func (ms *MatrixService) statusColor(message string) string {
	lower := strings.ToLower(message)
	if strings.Contains(lower, "🔴") || strings.Contains(lower, "down") ||
		strings.Contains(lower, "expired") || strings.Contains(lower, "failed") ||
		strings.Contains(lower, "critical") || strings.Contains(lower, "error") {
		return "#E74C3C" // Red
	}
	if strings.Contains(lower, "🟡") || strings.Contains(lower, "warning") ||
		strings.Contains(lower, "expiring") {
		return "#F39C12" // Yellow
	}
	if strings.Contains(lower, "🟠") || strings.Contains(lower, "maintenance") ||
		strings.Contains(lower, "paused") {
		return "#E67E22" // Orange
	}
	if strings.Contains(lower, "🟢") || strings.Contains(lower, "up") ||
		strings.Contains(lower, "resolved") || strings.Contains(lower, "restored") ||
		strings.Contains(lower, "success") {
		return "#2ECC71" // Green
	}
	return "#3498DB" // Blue — info / default
}

// SendServerNotification sends a server-specific notification via Matrix
func (ms *MatrixService) SendServerNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) error {
	message := ms.generateServerMessage(payload, template, resourceType)
	return ms.SendNotification(config, message)
}

// SendServiceNotification sends a service-specific notification via Matrix
func (ms *MatrixService) SendServiceNotification(config *AlertConfiguration, payload *NotificationPayload, template *ServiceNotificationTemplate) error {
	message := ms.generateServiceMessage(payload, template)
	return ms.SendNotification(config, message)
}

func (ms *MatrixService) generateServerMessage(payload *NotificationPayload, template *ServerNotificationTemplate, resourceType string) string {
	var templateMessage string

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

	if templateMessage == "" {
		templateMessage = ms.generateDefaultServerMessage(payload, resourceType)
	}

	return ms.replacePlaceholders(templateMessage, payload)
}

func (ms *MatrixService) generateServiceMessage(payload *NotificationPayload, template *ServiceNotificationTemplate) string {
	var templateMessage string

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

	if templateMessage == "" {
		templateMessage = ms.generateDefaultUptimeMessage(payload)
	}

	return ms.replacePlaceholders(templateMessage, payload)
}

func (ms *MatrixService) replacePlaceholders(message string, payload *NotificationPayload) string {
	message = strings.ReplaceAll(message, "${service_name}", payload.ServiceName)
	message = strings.ReplaceAll(message, "${status}", strings.ToUpper(payload.Status))
	message = strings.ReplaceAll(message, "${host}", ms.safeString(payload.Host))
	message = strings.ReplaceAll(message, "${hostname}", ms.safeString(payload.Hostname))

	u := ms.safeString(payload.URL)
	if u == "N/A" && payload.Host != "" {
		u = payload.Host
	}
	message = strings.ReplaceAll(message, "${url}", u)
	message = strings.ReplaceAll(message, "${domain}", ms.safeString(payload.Domain))

	if payload.ServiceType != "" {
		message = strings.ReplaceAll(message, "${service_type}", strings.ToUpper(payload.ServiceType))
	} else {
		message = strings.ReplaceAll(message, "${service_type}", "N/A")
	}

	message = strings.ReplaceAll(message, "${region_name}", ms.safeString(payload.RegionName))
	message = strings.ReplaceAll(message, "${agent_id}", ms.safeString(payload.AgentID))

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

	message = strings.ReplaceAll(message, "${cpu_usage}", ms.safeString(payload.CPUUsage))
	message = strings.ReplaceAll(message, "${ram_usage}", ms.safeString(payload.RAMUsage))
	message = strings.ReplaceAll(message, "${disk_usage}", ms.safeString(payload.DiskUsage))
	message = strings.ReplaceAll(message, "${network_usage}", ms.safeString(payload.NetworkUsage))
	message = strings.ReplaceAll(message, "${cpu_temp}", ms.safeString(payload.CPUTemp))
	message = strings.ReplaceAll(message, "${disk_io}", ms.safeString(payload.DiskIO))
	message = strings.ReplaceAll(message, "${threshold}", ms.safeString(payload.Threshold))
	message = strings.ReplaceAll(message, "${error_message}", ms.safeString(payload.ErrorMessage))
	message = strings.ReplaceAll(message, "${error}", ms.safeString(payload.ErrorMessage))
	message = strings.ReplaceAll(message, "${time}", payload.Timestamp.Format("2006-01-02 15:04:05"))
	message = strings.ReplaceAll(message, "${timestamp}", payload.Timestamp.Format("2006-01-02 15:04:05"))

	return message
}

func (ms *MatrixService) safeString(value string) string {
	if value == "" {
		return "N/A"
	}
	return value
}

func (ms *MatrixService) generateDefaultUptimeMessage(payload *NotificationPayload) string {
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

	details := []string{}
	if payload.URL != "" {
		details = append(details, fmt.Sprintf(" - Host URL: %s", payload.URL))
	} else if payload.Host != "" {
		details = append(details, fmt.Sprintf(" - Host: %s", payload.Host))
	}
	if payload.ServiceType != "" {
		details = append(details, fmt.Sprintf(" - Type: %s", strings.ToUpper(payload.ServiceType)))
	}
	if payload.Port > 0 {
		details = append(details, fmt.Sprintf(" - Port: %d", payload.Port))
	}
	if payload.Domain != "" {
		details = append(details, fmt.Sprintf(" - Domain: %s", payload.Domain))
	}
	if payload.ResponseTime > 0 {
		details = append(details, fmt.Sprintf(" - Response time: %dms", payload.ResponseTime))
	} else {
		details = append(details, " - Response time: N/A")
	}
	if payload.RegionName != "" {
		details = append(details, fmt.Sprintf(" - Region: %s", payload.RegionName))
	}
	if payload.Uptime > 0 {
		details = append(details, fmt.Sprintf(" - Uptime: %d%%", payload.Uptime))
	}
	details = append(details, fmt.Sprintf(" - Time: %s", payload.Timestamp.Format("2006-01-02 15:04:05")))

	if len(details) > 0 {
		message += "\n" + strings.Join(details, "\n")
	}
	return message
}

func (ms *MatrixService) generateDefaultServerMessage(payload *NotificationPayload, resourceType string) string {
	statusEmoji := "🔵"
	switch strings.ToLower(payload.Status) {
	case "up":
		statusEmoji = "🟢"
	case "down":
		statusEmoji = "🔴"
	case "warning":
		statusEmoji = "🟡"
	}
	resource := strings.ToUpper(resourceType)
	if resource == "" {
		resource = "GENERAL"
	}
	return fmt.Sprintf("%s 🖥️ Server %s (%s) [%s] status: %s", statusEmoji, payload.ServiceName, payload.Hostname, resource, strings.ToUpper(payload.Status))
}
