
package notification

import "time"

// NotificationPayload represents the data sent in notifications
type NotificationPayload struct {
	ServiceName   string    `json:"service_name"`
	Status        string    `json:"status"`
	Host          string    `json:"host"`
	Hostname      string    `json:"hostname"`
	Port          int       `json:"port"`
	ServiceType   string    `json:"service_type"`
	ResponseTime  int64     `json:"response_time"`
	Timestamp     time.Time `json:"timestamp"`
	Message       string    `json:"message"`
	ErrorMessage  string    `json:"error_message,omitempty"`
	
	// Service-specific fields
	URL           string    `json:"url,omitempty"`
	Domain        string    `json:"domain,omitempty"`
	RegionName    string    `json:"region_name,omitempty"`
	AgentID       string    `json:"agent_id,omitempty"`
	Uptime        int       `json:"uptime,omitempty"`
	
	// Server monitoring specific fields
	CPUUsage      string    `json:"cpu_usage,omitempty"`
	RAMUsage      string    `json:"ram_usage,omitempty"`
	DiskUsage     string    `json:"disk_usage,omitempty"`
	NetworkUsage  string    `json:"network_usage,omitempty"`
	CPUTemp       string    `json:"cpu_temp,omitempty"`
	DiskIO        string    `json:"disk_io,omitempty"`
	Threshold     string    `json:"threshold,omitempty"`
	
	// SSL Certificate specific fields
	CertificateName string    `json:"certificate_name,omitempty"`
	ExpiryDate      string    `json:"expiry_date,omitempty"`
	DaysLeft        string    `json:"days_left,omitempty"`
	IssuerCN        string    `json:"issuer_cn,omitempty"`
	SerialNumber    string    `json:"serial_number,omitempty"`
}

// AlertConfiguration represents an alert configuration from PocketBase
type AlertConfiguration struct {
	ID                    string `json:"id"`
	NotificationType      string `json:"notification_type"`
	TelegramChatID        string `json:"telegram_chat_id"`
	DiscordWebhookURL     string `json:"discord_webhook_url"`
	SignalNumber          string `json:"signal_number"`
	SignalAPIEndpoint     string `json:"signal_api_endpoint"`
	NotifyName            string `json:"notify_name"`
	BotToken              string `json:"bot_token"`
	TemplateID            string `json:"template_id"`
	SlackWebhookURL       string `json:"slack_webhook_url"`
	GoogleChatWebhookURL  string `json:"google_chat_webhook_url"`
	Enabled               string `json:"enabled"` // String because PocketBase returns it as string
	EmailAddress          string `json:"email_address"`
	EmailSenderName       string `json:"email_sender_name"`
	SMTPServer            string `json:"smtp_server"`
	SMTPPassword          string `json:"smtp_password,omitempty"`
	SMTPPort              string `json:"smtp_port"`
	WebhookID             string `json:"webhook_id"`
	ChannelID             string `json:"channel_id"`
	WebhookURL            string `json:"webhook_url"`
	WebhookPayloadTemplate string `json:"webhook_payload_template"`
	NtfyEndpoint          string `json:"ntfy_endpoint"`
}

// ServerNotificationTemplate represents a server notification template
type ServerNotificationTemplate struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	UpMessage      string `json:"up_message"`
	DownMessage    string `json:"down_message"`
	WarningMessage string `json:"warning_message"`
	PausedMessage  string `json:"paused_message"`
	// Resource-specific messages
	RAMMessage     string `json:"ram_message"`
	CPUMessage     string `json:"cpu_message"`
	DiskMessage    string `json:"disk_message"`
	NetworkMessage string `json:"network_message"`
	CPUTempMessage string `json:"cpu_temp_message"`
	DiskIOMessage  string `json:"disk_io_message"`
	// Resource restore messages
	RestoreRAMMessage     string `json:"restore_ram_message"`
	RestoreCPUMessage     string `json:"restore_cpu_message"`
	RestoreDiskMessage    string `json:"restore_disk_message"`
	RestoreNetworkMessage string `json:"restore_network_message"`
	RestoreCPUTempMessage string `json:"restore_cpu_temp_message"`
	RestoreDiskIOMessage  string `json:"restore_disk_io_message"`
	Placeholder    string `json:"placeholder"`
}

// ServiceNotificationTemplate represents a service notification template
type ServiceNotificationTemplate struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	UpMessage           string `json:"up_message"`
	DownMessage         string `json:"down_message"`
	MaintenanceMessage  string `json:"maintenance_message"`
	IncidentMessage     string `json:"incident_message"`
	ResolvedMessage     string `json:"resolved_message"`
	WarningMessage      string `json:"warning_message"`
	Placeholder         string `json:"placeholder"`
}

// NotificationResponse represents the response from notification APIs (like Telegram)
type NotificationResponse struct {
	OK          bool   `json:"ok"`
	Description string `json:"description,omitempty"`
	ErrorCode   int    `json:"error_code,omitempty"`
	Result      interface{} `json:"result,omitempty"`
}

// NotificationService interface for different notification services
type NotificationService interface {
	SendNotification(config *AlertConfiguration, message string) error
}