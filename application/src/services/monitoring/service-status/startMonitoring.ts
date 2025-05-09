
import { pb } from '@/lib/pocketbase';
import { monitoringIntervals } from '../monitoringIntervals';
import { checkHttpService } from '../httpChecker';

/**
 * Start monitoring for a specific service
 */
export async function startMonitoringService(serviceId: string): Promise<void> {
  try {
    // First check if the service is already being monitored
    if (monitoringIntervals.has(serviceId)) {
      console.log(`Service ${serviceId} is already being monitored`);
      return;
    }
    
    // Fetch the service to get its current configuration
    const service = await pb.collection('services').getOne(serviceId);
    
    // If service was manually paused, don't auto-resume
    if (service.status === "paused") {
      console.log(`Service ${serviceId} (${service.name}) is paused. Not starting monitoring.`);
      return;
    }
    
    console.log(`Starting monitoring for service ${serviceId} (${service.name})`);
    
    // Update the service status to active/up in the database
    await pb.collection('services').update(serviceId, {
      status: "up",
    });
    
    // Start with an immediate check
    await checkHttpService(serviceId);
    
    // Then schedule regular checks based on the interval
    const intervalMs = (service.heartbeat_interval || 60) * 1000; // Convert from seconds to milliseconds
    console.log(`Setting check interval for ${service.name} to ${intervalMs}ms (${service.heartbeat_interval || 60} seconds)`);
    
    // Store the interval ID so we can clear it later if needed
    const intervalId = window.setInterval(async () => {
      try {
        // Check if service has been paused since scheduling
        const currentService = await pb.collection('services').getOne(serviceId);
        if (currentService.status === "paused") {
          console.log(`Service ${serviceId} is now paused. Skipping scheduled check.`);
          return;
        }
        
        console.log(`Running scheduled check for service ${service.name}`);
        await checkHttpService(serviceId);
      } catch (error) {
        console.error(`Error in scheduled check for ${service.name}:`, error);
      }
    }, intervalMs);
    
    // Store the interval ID for this service
    monitoringIntervals.set(serviceId, intervalId);
    
    console.log(`Monitoring scheduled for service ${serviceId} every ${service.heartbeat_interval || 60} seconds`);
  } catch (error) {
    console.error("Error starting service monitoring:", error);
  }
}
