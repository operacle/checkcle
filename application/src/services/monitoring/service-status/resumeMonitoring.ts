
import { pb } from '@/lib/pocketbase';
import { monitoringIntervals } from '../monitoringIntervals';
import { notificationService } from '@/services/notificationService';
import { Service } from '@/types/service.types';
import { startMonitoringService } from './startMonitoring';

/**
 * Specifically resume a paused service
 */
export async function resumeMonitoring(serviceId: string): Promise<void> {
  try {
    // Get current timestamp formatted as a string
    const now = new Date().toISOString();
    
    // Fetch the current service to get its name for better logging
    const service = await pb.collection('services').getOne(serviceId);
    
    console.log(`Resuming service ${service.name} at ${now}`);
    
    // First, clear any existing interval just to be safe
    const existingInterval = monitoringIntervals.get(serviceId);
    if (existingInterval) {
      clearInterval(existingInterval);
      monitoringIntervals.delete(serviceId);
    }
    
    // Update the service status to "up" in the database
    await pb.collection('services').update(serviceId, {
      status: "up",
      lastChecked: now,
      last_checked: now
    });
    
    // Convert PocketBase record to Service type for notification
    const serviceForNotification: Service = {
      id: service.id,
      name: service.name,
      url: service.url || "",
      type: service.service_type || service.type || "HTTP",
      status: "up",
      responseTime: service.response_time || 0,
      uptime: service.uptime || 0,
      lastChecked: now,
      interval: service.heartbeat_interval || 60,
      retries: service.max_retries || 3,
      notificationChannel: service.notification_id,
      alertTemplate: service.template_id,
      muteAlerts: service.mute_alerts || false,
      alerts: service.alerts || "unmuted",
      muteChangedAt: service.mute_changed_at,
    };
    
    // Double check if alerts are muted before sending notification
    // Ensure we're using the correct field - alerts should be "muted" or "unmuted"
    const alertsMuted = service.alerts === "muted" || serviceForNotification.alerts === "muted";
    
    if (!alertsMuted) {
      console.log(`Alerts NOT muted for service ${service.name}, sending resume notification`);
      // Send notification that service has been resumed
      await notificationService.sendNotification({
        service: serviceForNotification,
        status: "up",
        timestamp: now
      });
    } else {
      console.log(`Alerts muted for service ${service.name}, skipping resume notification`);
    }
    
    // IMPORTANT: Wait a brief moment to ensure the status update is processed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Now start the service monitoring with a clean slate
    await startMonitoringService(serviceId);
    
    console.log(`Service ${service.name} resumed and ready for monitoring`);
  } catch (error) {
    console.error("Error resuming service:", error);
  }
}
