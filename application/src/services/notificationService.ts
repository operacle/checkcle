
import { Service } from "@/types/service.types";
import { processTemplate, generateDefaultMessage } from "./notification/templateProcessor";
import { sendTelegramNotification } from "./notification/telegramService";
import { sendWecomNotification, testSendWecomMessage } from "./notification/wecomService";
import { pb } from "@/lib/pocketbase";
import { templateService } from "./templateService";
import { AlertConfiguration } from "./alertConfigService";

interface NotificationData {
  service: Service;
  status: string;
  responseTime?: number;
  timestamp: string;
  _notificationSource?: string;
}

// Track last notification times for services to implement cooldown
const lastNotifications: Record<string, {
  timestamp: Date;
  count: number;
}> = {};

// Cooldown period in milliseconds (5 minutes)
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; 

export const notificationService = {
  /**
   * Send a notification for a service status change
   */
  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      const { service, status, responseTime } = data;
      
    //  console.log(`Preparing to send notification for service: ${service.name}, status: ${status}`);
     // console.log(`Service alerts status: ${service.alerts}`);
      
      // First check if alerts are muted for this service
      // STRICT equality check against "muted" string value
      if (service.alerts === "muted") {
      //  console.log(`NOTIFICATION BLOCKED: Alerts are muted for service: ${service.name}`);
        return true; // Return true as this is expected behavior
      }
      
      // For paused status, check if this is a duplicate notification from another source
      // This helps prevent the double-notification issue
      if (status === "paused" && data._notificationSource === "duplicate_check") {
       // console.log("NOTIFICATION BLOCKED: Duplicate pause notification detected");
        return true; // Return true as this is expected behavior
      }
      
      // For DOWN status, implement the cooldown and max retries logic
      if (status === "down") {
        const serviceId = service.id;
        const maxRetries = service.retries || 3; // Default to 3 if not specified
        const now = new Date();
        
        if (lastNotifications[serviceId]) {
          const lastNotif = lastNotifications[serviceId];
          const timeSinceLastNotif = now.getTime() - lastNotif.timestamp.getTime();
          
          // Check if we're within the cooldown period
          if (timeSinceLastNotif < NOTIFICATION_COOLDOWN) {
            // Increment count only if we haven't reached max retries
            if (lastNotif.count < maxRetries) {
         //     console.log(`DOWN notification for ${service.name}: ${lastNotif.count + 1}/${maxRetries}`);
              lastNotifications[serviceId].count += 1;
            } else {
         //     console.log(`DOWN notification for ${service.name} skipped: Max retries (${maxRetries}) reached. Next notification after cooldown.`);
              return true; // Skip notification but return success
            }
          } else {
            // Reset count after cooldown period
       //     console.log(`Cooldown period elapsed for ${service.name}. Resetting notification count.`);
            lastNotifications[serviceId] = { timestamp: now, count: 1 };
          }
        } else {
          // First notification for this service
      //    console.log(`First DOWN notification for ${service.name}: 1/${maxRetries}`);
          lastNotifications[serviceId] = { timestamp: now, count: 1 };
        }
        
        // Update timestamp for the current notification
        lastNotifications[serviceId].timestamp = now;
      }
      
      // Check if notification channel is set
      if (!service.notificationChannel) {
      // console.log(`No notification channel set for service: ${service.name}`);
        return false;
      }
      
      // Fetch the notification configuration
      const alertConfigRecord = await pb.collection('alert_configurations').getOne(service.notificationChannel);
      
      if (!alertConfigRecord) {
      //  console.error(`Alert configuration not found for ID: ${service.notificationChannel}`);
        return false;
      }
      
      if (!alertConfigRecord.enabled) {
      //  console.log(`Alert configuration is disabled for service: ${service.name}`);
        return false;
      }
      
      // Convert PocketBase record to AlertConfiguration
      const alertConfig: AlertConfiguration = {
        id: alertConfigRecord.id,
        collectionId: alertConfigRecord.collectionId,
        collectionName: alertConfigRecord.collectionName,
        service_id: alertConfigRecord.service_id || "",
        notification_type: alertConfigRecord.notification_type,
        telegram_chat_id: alertConfigRecord.telegram_chat_id,
        discord_webhook_url: alertConfigRecord.discord_webhook_url,
        signal_number: alertConfigRecord.signal_number,
        notify_name: alertConfigRecord.notify_name,
        bot_token: alertConfigRecord.bot_token,
        template_id: alertConfigRecord.template_id,
        slack_webhook_url: alertConfigRecord.slack_webhook_url,
        wecom_webhook_url: alertConfigRecord.wecom_webhook_url,
        enabled: alertConfigRecord.enabled,
        created: alertConfigRecord.created,
        updated: alertConfigRecord.updated
      };
      
      // Select template if one is specified
      let template;
      if (service.alertTemplate) {
        try {
          template = await templateService.getTemplate(service.alertTemplate);
        } catch (error) {
        //  console.error(`Error fetching template for ID: ${service.alertTemplate}`, error);
        }
      }
      
      // Generate the notification message
      let message;
      if (template) {
        message = processTemplate(template, service, status, responseTime);
      } else {
        message = generateDefaultMessage(service.name, status, responseTime);
      }
      
      // For DOWN status, add retry information to the message
      if (status === "down" && lastNotifications[service.id]) {
        const retryInfo = lastNotifications[service.id];
        const maxRetries = service.retries || 3;
        message += `\n\nAlert ${retryInfo.count}/${maxRetries}`;
      }
      
    //  console.log(`Prepared notification message: ${message}`);
      
      // Send notification based on notification type
      const notificationType = alertConfig.notification_type;
      
      if (notificationType === 'telegram') {
        return await sendTelegramNotification(alertConfig, message);
      } else if (notificationType === 'wecom') {
        return await sendWecomNotification(alertConfig, message, status);
      }
      
      // For other types like discord, slack, etc. (not implemented yet)
    //  console.log(`Notification type ${notificationType} not implemented yet`);
      return false;
    } catch (error) {
    //  console.error("Error sending notification:", error);
      return false;
    }
  },
  
  /**
   * Send a test notification for a service status change
   */
  async testServiceStatusNotification(serviceName: string, status: string, responseTime?: number): Promise<boolean> {
    try {
      const message = status === 'up'
        ? `Service ${serviceName} is UP${responseTime ? ` (Response time: ${responseTime}ms)` : ''}`
        : `Service ${serviceName} is DOWN`;
        
    //  console.log(`Test notification would have been sent: ${message}`);
      return true;  // Just log, don't actually send
    } catch (error) {
    //  console.error("Error in test notification:", error);
      return false;
    }
  },

  /**
   * Reset notification count for a service
   * This can be called when a service recovers from DOWN to UP
   */
  resetNotificationCount(serviceId: string): void {
    if (lastNotifications[serviceId]) {
    //  console.log(`Resetting notification count for service ${serviceId}`);
      delete lastNotifications[serviceId];
    }
  }
};
