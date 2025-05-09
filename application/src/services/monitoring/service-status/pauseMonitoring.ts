
import { pb } from '@/lib/pocketbase';
import { monitoringIntervals } from '../monitoringIntervals';
import { Service } from '@/types/service.types';

/**
 * Pause monitoring for a specific service
 */
export async function pauseMonitoring(serviceId: string): Promise<void> {
  try {
    // Clear the monitoring interval if it exists
    const intervalId = monitoringIntervals.get(serviceId);
    if (intervalId) {
      clearInterval(intervalId);
      monitoringIntervals.delete(serviceId);
      console.log(`Monitoring paused for service ${serviceId}`);
    }
    
    // Get current timestamp formatted as a string
    const now = new Date().toISOString();
    
    // Fetch the current service to get its name for better logging
    const service = await pb.collection('services').getOne(serviceId);
    
    // Update the service status to paused and store the exact pause time
    await pb.collection('services').update(serviceId, {
      status: "paused",
      lastChecked: now,
      last_checked: now  // Ensure both field names are updated
    });
    
    // We'll skip the notification here since it will be handled by the UI component
    // This prevents duplicate notifications for the paused status
    console.log(`Service ${service.name} paused at ${now}, skipping notification to prevent duplication`);
  } catch (error) {
    console.error("Error pausing monitoring:", error);
  }
}
