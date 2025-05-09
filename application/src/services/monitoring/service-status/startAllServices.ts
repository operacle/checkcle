
import { pb } from '@/lib/pocketbase';
import { startMonitoringService } from './startMonitoring';

/**
 * Start monitoring for all active services
 */
export async function startAllActiveServices(): Promise<void> {
  try {
    // Get all services that are not paused
    const result = await pb.collection('services').getList(1, 100, {
      filter: 'status != "paused"'
    });
    
    console.log(`Starting monitoring for ${result.items.length} active services`);
    
    // Start monitoring each active service
    for (const service of result.items) {
      await startMonitoringService(service.id);
    }
  } catch (error) {
    console.error("Error starting all active services:", error);
  }
}
