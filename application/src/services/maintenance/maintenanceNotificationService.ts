
import { MaintenanceItem } from '../types/maintenance.types';
import { alertConfigService, AlertConfiguration } from '../alertConfigService';
import { sendTelegramNotification } from '../notification/telegramService';
import { pb } from '@/lib/pocketbase';
import { formatDistanceToNow } from 'date-fns';

interface NotificationParams {
  maintenance: MaintenanceItem;
  notificationType: 'start' | 'end' | 'update';
}

export const maintenanceNotificationService = {
  /**
   * Send notification for maintenance events
   */
  async sendMaintenanceNotification({ maintenance, notificationType }: NotificationParams): Promise<boolean> {
    try {
      console.log(`Preparing to send ${notificationType} notification for maintenance: ${maintenance.title}`);
      
      // Get notification channel ID - try both fields
      let notificationChannelId = maintenance.notification_channel_id;
      
      // If notification_channel_id is empty, try to use notification_id
      if (!notificationChannelId && maintenance.notification_id) {
        console.log(`No notification_channel_id found, using notification_id: ${maintenance.notification_id}`);
        notificationChannelId = maintenance.notification_id;
      }
      
      // Check if maintenance has notification channel configured
      if (!notificationChannelId) {
        console.log("No notification channel configured for this maintenance");
        return false;
      }
      
      console.log(`Using notification channel ID: ${notificationChannelId}`);
      
      // Get notification channel configuration
      let notificationConfig: AlertConfiguration;
      try {
        const config = await pb.collection('alert_configurations').getOne(notificationChannelId);
        notificationConfig = config as unknown as AlertConfiguration;
      } catch (error) {
        console.error("Failed to fetch notification configuration:", error);
        return false;
      }
      
      if (!notificationConfig.enabled) {
        console.log("Notification channel is disabled");
        return false;
      }
      
      // Create notification message based on type
      const message = this.generateMaintenanceMessage(maintenance, notificationType);
      
      console.log(`Sending ${notificationConfig.notification_type} notification with message: ${message}`);
      
      // Send notification based on channel type
      if (notificationConfig.notification_type === 'telegram') {
        return await sendTelegramNotification(notificationConfig, message);
      }
      
      // Add more notification types here as needed
      
      console.log(`Unsupported notification type: ${notificationConfig.notification_type}`);
      return false;
    } catch (error) {
      console.error("Error sending maintenance notification:", error);
      return false;
    }
  },
  
  /**
   * Generate message for maintenance notification
   */
  generateMaintenanceMessage(maintenance: MaintenanceItem, type: 'start' | 'end' | 'update'): string {
    const startDate = new Date(maintenance.start_time);
    const endDate = new Date(maintenance.end_time);
    const duration = formatDistanceToNow(endDate, { addSuffix: false });
    const affectedServices = maintenance.affected.split(',').map(s => s.trim()).join(', ');
    
    let emoji = '🔧';
    let statusText = '';
    let timeText = '';
    
    switch (type) {
      case 'start':
        emoji = '⚠️';
        statusText = 'has started';
        timeText = `Estimated duration: ${duration}`;
        break;
      case 'end':
        emoji = '✅';
        statusText = 'has completed';
        timeText = 'All systems are back to normal operation';
        break;
      case 'update':
        emoji = '🔄';
        statusText = 'has been updated';
        timeText = `Scheduled for ${startDate.toLocaleString()} to ${endDate.toLocaleString()}`;
        break;
    }
    
    return `${emoji} <b>Maintenance ${statusText}</b>

<b>Title:</b> ${maintenance.title}
<b>Description:</b> ${maintenance.description}
<b>Affected Services:</b> ${affectedServices}
<b>${timeText}</b>

<b>Priority:</b> ${maintenance.priority.toUpperCase()}
<b>Impact:</b> ${maintenance.field.toUpperCase()}`;
  }
};

// Set up scheduled maintenance notifications
export const setupMaintenanceNotificationsScheduler = () => {
  console.log("Setting up maintenance notifications scheduler");
  
  // Check every minute for maintenance that needs notifications
  const checkInterval = setInterval(async () => {
    try {
      console.log("Checking for maintenance notifications to send...");
      const now = new Date();
      
      // Fetch upcoming and ongoing maintenance
      const records = await pb.collection('maintenance').getList(1, 100, {
        filter: `status = 'scheduled' || status = 'in_progress'`,
      });
      
      if (!records || !records.items || records.items.length === 0) {
        return;
      }
      
      // Check each maintenance record
      for (const record of records.items) {
        const maintenance = record as unknown as MaintenanceItem;
        const startTime = new Date(maintenance.start_time);
        const endTime = new Date(maintenance.end_time);
        
        // If maintenance is scheduled to start within the next minute or has just started
        if (maintenance.status === 'scheduled' && 
            startTime <= new Date(now.getTime() + 60000) && 
            startTime > new Date(now.getTime() - 60000)) {
          
          console.log(`Maintenance ${maintenance.title} is starting now, sending notification`);
          await maintenanceNotificationService.sendMaintenanceNotification({
            maintenance,
            notificationType: 'start'
          });
          
          // Update status to in_progress
          await pb.collection('maintenance').update(maintenance.id, {
            status: 'in_progress'
          });
        }
        
        // If maintenance is in progress and scheduled to end within the next minute or has just ended
        if (maintenance.status === 'in_progress' && 
            endTime <= new Date(now.getTime() + 60000) && 
            endTime > new Date(now.getTime() - 60000)) {
          
          console.log(`Maintenance ${maintenance.title} is ending now, sending notification`);
          await maintenanceNotificationService.sendMaintenanceNotification({
            maintenance,
            notificationType: 'end'
          });
          
          // Update status to completed
          await pb.collection('maintenance').update(maintenance.id, {
            status: 'completed'
          });
        }
      }
    } catch (error) {
      console.error("Error checking maintenance notifications:", error);
    }
  }, 60000); // Check every minute
  
  return checkInterval;
};

// Initialize the notification scheduler
let notificationScheduler: NodeJS.Timeout | null = null;

export const initMaintenanceNotifications = () => {
  if (notificationScheduler === null) {
    notificationScheduler = setupMaintenanceNotificationsScheduler();
    console.log("Maintenance notifications scheduler initialized");
  }
};

export const stopMaintenanceNotifications = () => {
  if (notificationScheduler !== null) {
    clearInterval(notificationScheduler);
    notificationScheduler = null;
    console.log("Maintenance notifications scheduler stopped");
  }
};
