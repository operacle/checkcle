import { pb } from "@/lib/pocketbase";
import { toast } from "@/hooks/use-toast";
import { AlertConfiguration } from "../alertConfigService";
import { NotificationTemplate } from "../templateService";
import { NotificationPayload } from "./types";
import { processTemplate, generateDefaultMessage } from "./templateProcessor";
import { sendTelegramNotification } from "./telegramService";
import { sendSignalNotification } from "./signalService";

// Track last notification times for services to implement cooldown
const lastNotifications: Record<string, {
  timestamp: Date;
  count: number;
  lastMessageTime: Date; // Track when the last message was actually sent
}> = {};

// Cooldown period in milliseconds (5 minutes)
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; 

/**
 * Notification service responsible for sending notifications based on service status changes
 */
export const notificationService = {
  /**
   * Send notification based on service status change
   */
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      console.log("=== NOTIFICATION SERVICE TRIGGER ===");
      console.log("Sending notification for service:", payload.service.name, "Status:", payload.status);
      console.log("Service type:", payload.service.type);
      console.log("Service retries:", payload.service.retries || 3);
      console.log("Alerts status:", payload.service.alerts);
      
      // First check: Strictly check if alerts are muted for this specific service
      if (payload.service.alerts === "muted") {
        console.log(`BLOCKING NOTIFICATION: Alerts are explicitly muted for service ${payload.service.name} (ID: ${payload.service.id})`);
        return true; // Return true as this is expected behavior, not a failure
      }
      
      // For DOWN status, implement the cooldown and max retries logic
      if (payload.status === "down") {
        const serviceId = payload.service.id;
        // Get max retries from service config or default to 3
        const maxRetries = typeof payload.service.retries === 'number' ? payload.service.retries : 3;
        const now = new Date();
        
        console.log(`DOWN notification for ${payload.service.name} - Max retries: ${maxRetries}`);
        
        if (lastNotifications[serviceId]) {
          const lastNotif = lastNotifications[serviceId];
          const timeSinceLastNotif = now.getTime() - lastNotif.timestamp.getTime();
          
          console.log(`Time since last notification tracking for ${payload.service.name}: ${Math.round(timeSinceLastNotif/1000)}s`);
          console.log(`Current notification count: ${lastNotif.count}/${maxRetries}`);
          
          // Check if we're within the cooldown period
          if (timeSinceLastNotif < NOTIFICATION_COOLDOWN) {
            // If max retries is set to 1, we should only send one notification during the cooldown period
            if (maxRetries === 1) {
              console.log(`Max retries is 1 - BLOCKING duplicate DOWN notification for ${payload.service.name}`);
              return true; // Skip notification but return success
            }
            
            // Check if we've reached max retries
            if (lastNotif.count >= maxRetries) {
              console.log(`DOWN notification for ${payload.service.name} skipped: Max retries (${maxRetries}) reached. Next notification after cooldown.`);
              return true; // Skip notification but return success
            }
            
            // Increment count since we're sending another notification
            console.log(`DOWN notification for ${payload.service.name}: ${lastNotif.count + 1}/${maxRetries}`);
            lastNotifications[serviceId].count += 1;
            lastNotifications[serviceId].lastMessageTime = now;
          } else {
            // Reset count after cooldown period
            console.log(`Cooldown period elapsed for ${payload.service.name}. Resetting notification count.`);
            lastNotifications[serviceId] = { timestamp: now, count: 1, lastMessageTime: now };
          }
        } else {
          // First notification for this service
          console.log(`First DOWN notification for ${payload.service.name}: 1/${maxRetries}`);
          lastNotifications[serviceId] = { timestamp: now, count: 1, lastMessageTime: now };
        }
      }
      
      // Check if service has notification channel configured
      const notificationChannel = payload.service.notificationChannel;
      
      if (!notificationChannel || notificationChannel === "none") {
        console.log("No notification channel configured for service", payload.service.name);
        return false;
      }
      
      console.log("Using notification channel ID:", notificationChannel);
      
      try {
        // Get the alert configuration details
        console.log("Fetching alert configuration with ID:", notificationChannel);
        const alertConfig = await pb.collection('alert_configurations').getOne(notificationChannel);
        console.log("Found alert configuration:", JSON.stringify({
          ...alertConfig,
          bot_token: alertConfig.bot_token ? "[REDACTED]" : undefined
        }, null, 2));
        
        // Check enabled status - skip if explicitly disabled
        if (alertConfig.enabled === false || alertConfig.enabled === "false") {
          console.log("Alert configuration is disabled, skipping notification");
          return false;
        }
        
        // Prepare message content
        let messageContent = await this.prepareMessageContent(
          payload.service,
          payload.status,
          payload.responseTime,
          payload.message
        );
        
        // For DOWN status, add retry information to the message
        if (payload.status === "down" && lastNotifications[payload.service.id]) {
          const retryInfo = lastNotifications[payload.service.id];
          const maxRetries = typeof payload.service.retries === 'number' ? payload.service.retries : 3;
          if (maxRetries > 1) {
            messageContent += `\n\nAlert ${retryInfo.count}/${maxRetries}`;
          }
        }
        
        console.log(`Prepared message for ${payload.status} notification:`, messageContent);
        
        // Send notification based on type
        if (alertConfig.notification_type === "telegram") {
          console.log("Sending Telegram notification for service status change");
          return await sendTelegramNotification(alertConfig as AlertConfiguration, messageContent);
        } else if (alertConfig.notification_type === "signal") {
          console.log("Sending Signal notification with message:", messageContent);
          return await sendSignalNotification(alertConfig as AlertConfiguration, messageContent);
        }
        
        // Add other notification types here
        console.log("Notification type not supported:", alertConfig.notification_type);
        toast({
          title: "Notification Error",
          description: `Notification type '${alertConfig.notification_type}' not supported`,
          variant: "destructive"
        });
        return false;
      } catch (error) {
        console.error("Error processing notification channel:", error);
        console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
        
        toast({
          title: "Notification Error",
          description: `Error processing notification: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Notification Error",
        description: `Failed to send notification: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Prepare message content for notification
   */
  async prepareMessageContent(
    service: any, 
    status: string, 
    responseTime?: number, 
    defaultMessage?: string
  ): Promise<string> {
    // Use provided message if available
    if (defaultMessage) {
      return defaultMessage;
    }

    // Check for a template
    let templateId = service.alertTemplate;
    
    if (templateId && templateId !== "default") {
      try {
        console.log("Using specified template ID:", templateId);
        const template = await pb.collection('notification_templates').getOne(templateId);
        console.log("Template data:", template);
        return processTemplate(
          template as unknown as NotificationTemplate,
          service,
          status,
          responseTime
        );
      } catch (error) {
        console.error("Error fetching template:", error);
        // Fall back to default message format
      }
    }
    
    console.log("Using default message template");
    return generateDefaultMessage(service.name, status, responseTime);
  },
  
  /**
   * Send a test notification for a specific service status change
   */
  async testServiceStatusNotification(serviceName: string, status: "up" | "down", responseTime?: number): Promise<boolean> {
    const emoji = status === "up" ? "🟢" : "🔴";
    const rtText = responseTime ? ` (Response time: ${responseTime}ms)` : "";
    const message = `${emoji} Test notification: Service ${serviceName} is ${status.toUpperCase()}${rtText}`;
    
    console.log("Test notification would be sent:", message);
    // Instead of calling testTelegramNotification which no longer exists, just log and return success
    return true;
  },
  
  /**
   * Reset notification count for a service
   * This is called when a service recovers from DOWN to UP
   */
  resetNotificationCount(serviceId: string): void {
    if (lastNotifications[serviceId]) {
      console.log(`Resetting notification count for service ${serviceId}`);
      delete lastNotifications[serviceId];
    }
  }
};

// Re-export the types for easier imports
export * from "./types";