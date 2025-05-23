
import { pb } from '@/lib/pocketbase';
import { MaintenanceItem, CreateMaintenanceInput } from '../../types/maintenance.types';
import { clearCache } from './maintenanceCache';

/**
 * Update the status of a maintenance record
 */
export const updateMaintenanceStatus = async (id: string, status: string): Promise<void> => {
  try {
    await pb.collection('maintenance').update(id, { status });
    clearCache();
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
};

/**
 * Update a maintenance record with partial data
 */
export const updateMaintenance = async (id: string, data: Partial<MaintenanceItem>): Promise<void> => {
  try {
    // Format assigned_users for storage
    const formattedData = { ...data };
    
    // Ensure assigned_users is stored in a consistent format (JSON string)
    if (formattedData.assigned_users) {
      if (Array.isArray(formattedData.assigned_users)) {
        formattedData.assigned_users = JSON.stringify(formattedData.assigned_users);
      }
    }
    
    console.log("Updating maintenance record with formatted data:", formattedData);
    
    await pb.collection('maintenance').update(id, formattedData);
    clearCache();
  } catch (error) {
    console.error('Error updating maintenance:', error);
    throw error;
  }
};

/**
 * Delete a maintenance record
 */
export const deleteMaintenance = async (id: string): Promise<void> => {
  try {
    await pb.collection('maintenance').delete(id);
    clearCache();
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    throw error;
  }
};

/**
 * Create a new maintenance record
 */
export const createMaintenance = async (data: CreateMaintenanceInput): Promise<void> => {
  try {
    // Format data for submission
    const formattedData = { ...data };
    
    // Ensure assigned_users is stored in a consistent format (JSON string)
    if (formattedData.assigned_users) {
      if (Array.isArray(formattedData.assigned_users)) {
        formattedData.assigned_users = JSON.stringify(formattedData.assigned_users);
      }
    }
    
    // Ensure notification_id is set from notification_channel_id if not already present
    if (formattedData.notification_channel_id && !formattedData.notification_id) {
      formattedData.notification_id = formattedData.notification_channel_id;
    }
    
    console.log("Creating maintenance record with formatted data:", formattedData);
    
    await pb.collection('maintenance').create(formattedData);
    clearCache();
  } catch (error) {
    console.error('Error creating maintenance:', error);
    throw error;
  }
};
