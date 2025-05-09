
import { pb } from '@/lib/pocketbase';
import { formatCurrentTime, makeHttpRequest } from './utils/httpUtils';
import { handleServiceUp, handleServiceDown } from './handlers/serviceStatusHandlers';
import { notificationService } from '@/services/notificationService';

/**
 * Check the status of an HTTP service
 */
export async function checkHttpService(serviceId: string): Promise<void> {
  try {
    // Fetch the service record from PocketBase
    const service = await pb.collection('services').getOne(serviceId);
    
    if (!service) {
      console.log(`Service with ID ${serviceId} not found`);
      return;
    }
    
    // Use the URL directly if provided, or construct from host
    const serviceUrl = service.url || (service.host ? `https://${service.host}` : null);
    
    if (!serviceUrl) {
      console.log(`No valid URL or host for service ID: ${serviceId}`);
      return;
    }
    
    // Format the current timestamp for display
    const formattedTime = formatCurrentTime();
    
    console.log(`===============================================`);
    console.log(`Starting HTTP service check: ${service.name} (${service.id})`);
    console.log(`URL: ${serviceUrl}`);
    console.log(`Current Status: ${service.status}`);
    console.log(`Mute Alerts: ${service.mute_alerts || service.muteAlerts ? "YES" : "NO"}`);
    console.log(`Time: ${formattedTime}`);
    
    // Use high resolution timer for more accurate response time measurement
    const startTime = performance.now();
    const maxRetries = service.max_retries || 3;
    
    // Make the request with improved retry logic
    const { isUp, responseTime } = await makeHttpRequest(serviceUrl, maxRetries);
    
    console.log(`Service ${service.name} check result: ${isUp ? 'UP' : 'DOWN'}, responseTime: ${responseTime}ms`);
    
    // Handle service status based on check result
    if (isUp) {
      await handleServiceUp(service, responseTime, formattedTime);
    } else {
      await handleServiceDown(service, formattedTime);
    }
    
    console.log(`Uptime data recorded for ${service.name}`);
    console.log(`===============================================`);
  } catch (error) {
    console.error("Error in HTTP service monitoring:", error);
  }
}

/**
 * Force test the notification system with a specified service ID and status
 */
export async function testServiceNotification(serviceId: string, status: "up" | "down"): Promise<void> {
  try {
    // Fetch the service
    const service = await pb.collection('services').getOne(serviceId);
    
    if (!service) {
      console.error(`Service with ID ${serviceId} not found for test notification`);
      return;
    }
    
    console.log(`Sending test ${status.toUpperCase()} notification for service ${service.name}`);
    
    // Send a test notification
    const message = status === "up" 
      ? `🟢 Test notification: Service ${service.name} is UP` 
      : `🔴 Test notification: Service ${service.name} is DOWN`;
    
    // Removed the actual test notification sending
    console.log(`Test notification prepared for service ${service.name}, status: ${status}`);
    // To manually test notifications, use the UI instead
  } catch (error) {
    console.error("Error preparing test notification:", error);
  }
}
