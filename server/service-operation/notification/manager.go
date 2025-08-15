
package notification

import (
	// "log"

	"service-operation/pocketbase"
)

// NotificationManager handles all notification operations
type NotificationManager struct {
	pbClient      *pocketbase.PocketBaseClient
	services      map[string]NotificationService
	serverManager *ServerNotificationManager
	uptimeManager *UptimeNotificationManager
	sslManager    *SSLNotificationManager
}

// NewNotificationManager creates a new notification manager
func NewNotificationManager(pbClient *pocketbase.PocketBaseClient) *NotificationManager {
	// Initialize notification services
	services := make(map[string]NotificationService)
	
	// log.Printf("🔧 Initializing notification services...")
	services["telegram"] = NewTelegramService()
	services["signal"] = NewSignalService()
	services["discord"] = NewDiscordService()
	services["slack"] = NewSlackService()
	services["google_chat"] = NewGoogleChatService()
	services["email"] = NewEmailService()
	services["webhook"] = NewWebhookService()
	services["ntfy"] = NewNtfyService()

	// log.Printf("✅ Notification services initialized: %v", getKeys(services))

	// Create specialized managers
	serverManager := NewServerNotificationManager(pbClient, services)
	uptimeManager := NewUptimeNotificationManager(pbClient, services)
	sslManager := NewSSLNotificationManager(pbClient, services)

	return &NotificationManager{
		pbClient:      pbClient,
		services:      services,
		serverManager: serverManager,
		uptimeManager: uptimeManager,
		sslManager:    sslManager,
	}
}

// SendServiceNotification sends notification for a service based on its configuration
func (nm *NotificationManager) SendServiceNotification(payload *NotificationPayload, notificationID, templateID string) error {
	return nm.serverManager.SendServiceNotification(payload, notificationID, templateID)
}

// SendResourceNotification sends notification for specific resource alerts (CPU, RAM, Disk, etc.)
func (nm *NotificationManager) SendResourceNotification(payload *NotificationPayload, notificationID, templateID, resourceType string) error {
	return nm.serverManager.SendResourceNotification(payload, notificationID, templateID, resourceType)
}

// SendUptimeServiceNotification sends notification for uptime services using service templates
func (nm *NotificationManager) SendUptimeServiceNotification(payload *NotificationPayload, notificationID, templateID string) error {
	return nm.uptimeManager.SendUptimeServiceNotification(payload, notificationID, templateID)
}

// SendSSLNotification sends notification for SSL certificates using SSL templates
func (nm *NotificationManager) SendSSLNotification(payload *NotificationPayload, notificationID, templateID string) error {
	return nm.sslManager.SendSSLNotification(payload, notificationID, templateID)
}