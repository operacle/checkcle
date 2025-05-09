
import { pb } from '@/lib/pocketbase';
import { formatCurrentTime } from './httpUtils';

/**
 * Records a mute status change for a service in the database
 * @param serviceId The ID of the service
 * @param serviceName The name of the service
 * @param muteStatus The new mute status (true = muted, false = unmuted)
 * @param userId Optional user ID who performed the action
 */
export async function recordMuteStatusChange(
  serviceId: string, 
  serviceName: string, 
  muteStatus: boolean,
  userId?: string
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const formattedTime = formatCurrentTime();
    
    console.log(`Recording ${muteStatus ? "mute" : "unmute"} status change for service ${serviceName} at ${formattedTime}`);
    
    // Update the service record with the correct alerts field value
    // Use both mute_alerts and alerts fields for backward compatibility
    const updateData = {
      mute_changed_at: timestamp,
      mute_alerts: muteStatus,
      alerts: muteStatus ? "muted" : "unmuted"  // Use the correct field name as per DB schema
    };
    
    console.log(`Updating service with data: ${JSON.stringify(updateData)}`);
    
    await pb.collection('services').update(serviceId, updateData);
    
    console.log(`Mute status change recorded for ${serviceName}: ${muteStatus ? "Muted" : "Unmuted"}`);
  } catch (error) {
    console.error("Error recording mute status change:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
