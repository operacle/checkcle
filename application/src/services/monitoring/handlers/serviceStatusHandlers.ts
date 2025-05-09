
import { pb } from '@/lib/pocketbase';
import { uptimeService } from '@/services/uptimeService';
import { notificationService } from '@/services/notification';  // Import from the main notification service
import { prepareServiceForNotification } from '../utils/httpUtils';
import { UptimeData } from '@/types/service.types';

/**
 * Handle a service that is determined to be UP
 */
export async function handleServiceUp(service: any, responseTime: number, formattedTime: string): Promise<void> {
  console.log(`Service ${service.name} is UP! Response time: ${responseTime}ms`);
  
  // Create a history record of this check with a more accurate timestamp
  const uptimeData: UptimeData = {
    serviceId: service.id,
    timestamp: new Date().toISOString(),
    status: "up",
    responseTime: responseTime,
    // Include required properties from the UptimeData interface
    date: new Date().toISOString(),
    uptime: 100
  };
  
  const previousStatus = service.status;
  const statusChanged = previousStatus !== "up" && previousStatus !== "paused";
  
  try {
    // Run service status update
    await pb.collection('services').update(service.id, {
      last_checked: formattedTime,
      response_time: responseTime,
      status: "up",
      // Calculate uptime percentage based on previous checks (simple moving average)
      uptime: service.uptime ? 
        (service.uptime * 0.9 + 100 * 0.1) : 100,
    });
    
    // Try to record uptime data, with retry logic
    try {
      await uptimeService.recordUptimeData(uptimeData);
    } catch (error) {
      console.error("Failed to record uptime data on first try, retrying...", error);
      // Wait a short time and retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      await uptimeService.recordUptimeData(uptimeData);
    }
    
    // Reset notification count if service is recovered from DOWN status
    if (previousStatus === "down") {
      console.log(`Service ${service.name} recovered from DOWN status - resetting notification count`);
      notificationService.resetNotificationCount(service.id);
    }
    
    // Send notification if status changed from down to up
    if (statusChanged) {
      console.log(`Status changed from ${previousStatus} to UP - sending notification`);
      
      // Convert PocketBase record to Service type for notification
      const serviceForNotification = prepareServiceForNotification(service, "up", responseTime);
      
      // Check if alerts are muted - STRICT check for "muted" string value
      if (service.alerts === "muted" || serviceForNotification.alerts === "muted") {
        console.log(`Alerts are MUTED for service ${service.name}, SKIPPING UP notification`);
        return;
      }
      
      try {
        // Send notification through main notification service
        await notificationService.sendNotification({
          service: serviceForNotification,
          status: "up",
          responseTime: responseTime,
          timestamp: new Date().toISOString()
        });
        
        console.log("UP notification sent successfully");
      } catch (error) {
        console.error("Error sending UP notification:", error);
      }
    }
  } catch (error) {
    console.error("Error handling service UP state:", error);
  }
}

/**
 * Handle a service that is determined to be DOWN
 */
export async function handleServiceDown(service: any, formattedTime: string): Promise<void> {
  console.log(`Service ${service.name} is DOWN!`);
  
  // Create a history record of this check
  const uptimeData: UptimeData = {
    serviceId: service.id,
    timestamp: new Date().toISOString(),
    status: "down",
    responseTime: 0,
    // Include required properties from the UptimeData interface
    date: new Date().toISOString(),
    uptime: 0
  };
  
  const previousStatus = service.status;
  const statusChanged = previousStatus !== "down";
  
  console.log(`Service ${service.name} previous status: ${previousStatus}, statusChanged: ${statusChanged}`);
  
  try {
    // Update service status
    await pb.collection('services').update(service.id, {
      last_checked: formattedTime,
      response_time: 0,
      status: "down",
      // Calculate uptime percentage based on previous checks
      uptime: service.uptime ? 
        (service.uptime * 0.9 + 0 * 0.1) : 0,
    });
    
    // Try to record uptime data with retry logic
    try {
      await uptimeService.recordUptimeData(uptimeData);
    } catch (error) {
      console.error("Failed to record uptime data on first try, retrying...", error);
      // Wait a short time and retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      await uptimeService.recordUptimeData(uptimeData);
    }
    
    // Convert PocketBase record to Service type for notification
    const serviceForNotification = prepareServiceForNotification(service, "down");
    
    // Check if alerts are muted - STRICT check for "muted" string value
    if (service.alerts === "muted" || serviceForNotification.alerts === "muted") {
      console.log(`Alerts are MUTED for service ${service.name}, SKIPPING DOWN notification`);
      return;
    }
    
    console.log("Attempting to send DOWN notification for service:", service.name);
    console.log("Service notification data:", {
      name: serviceForNotification.name,
      notificationChannel: serviceForNotification.notificationChannel,
      alertTemplate: serviceForNotification.alertTemplate,
      retries: serviceForNotification.retries || 3,
      alerts: serviceForNotification.alerts
    });
    
    try {
      // Use the main notification service - this handles retries internally
      const result = await notificationService.sendNotification({
        service: serviceForNotification,
        status: "down",
        responseTime: 0,
        timestamp: new Date().toISOString()
      });
      
      console.log("DOWN notification sent result:", result);
    } catch (error) {
      console.error("Error sending DOWN notification:", error);
    }
  } catch (error) {
    console.error("Error handling service DOWN state:", error);
  }
}
