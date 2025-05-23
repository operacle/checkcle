
import { pb, getCurrentEndpoint } from '@/lib/pocketbase';
import { MaintenanceItem, CreateMaintenanceInput } from './types/maintenance.types';

// Helper function to get the API URL
const getApiUrl = (): string => {
  return getCurrentEndpoint();
};

// Helper function to normalize maintenance items
const normalizeMaintenanceItem = (item: any): MaintenanceItem => {
  return {
    ...item,
    id: item.id || '',
    title: item.title || '',
    description: item.description || '',
    status: item.status || 'Scheduled',
    affected: item.affected || '',
    priority: item.priority || 'Medium',
    field: item.field || 'Minor',
  } as MaintenanceItem;
};

const getMaintenanceRecords = async (): Promise<MaintenanceItem[]> => {
  try {
    // Use a unique requestKey to prevent caching issues
    const timestamp = new Date().getTime();
    
    console.log("Fetching maintenance records from API...");
    
    // Increase items per page to ensure we get all records
    const result = await pb.collection('maintenance').getList(1, 200, {
      sort: '-created',
      requestKey: `maintenance-${timestamp}`,
    });
    
    console.log("Maintenance API response:", result);
    
    if (!result || !result.items || result.items.length === 0) {
      console.log("No maintenance records found");
      return [];
    }
    
    return result.items.map(normalizeMaintenanceItem);
  } catch (error) {
    // Handle abort errors gracefully without console errors
    if ((error as any)?.isAbort) {
      console.log("Request aborted:", error);
      return [];
    }
    
    console.error('Error fetching maintenance records:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

const getUpcomingMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    const currentDate = new Date();
    
    // Filter for upcoming maintenance
    const upcomingItems = allRecords.filter(item => {
      const status = item.status?.toLowerCase() || '';
      const startTime = new Date(item.start_time);
      
      return (status === 'scheduled' && startTime > currentDate);
    });
    
    return upcomingItems;
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    return [];
  }
};

const getOngoingMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    const currentDate = new Date();
    
    // Filter for ongoing maintenance
    const ongoingItems = allRecords.filter(item => {
      const status = item.status?.toLowerCase() || '';
      const startTime = new Date(item.start_time);
      const endTime = new Date(item.end_time);
      
      return status === 'in_progress' || 
             (status === 'scheduled' && startTime <= currentDate && endTime >= currentDate);
    });
    
    return ongoingItems;
  } catch (error) {
    console.error('Error fetching ongoing maintenance:', error);
    return [];
  }
};

const getCompletedMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    
    // Filter for completed maintenance
    const completedItems = allRecords.filter(item => {
      const status = item.status?.toLowerCase() || '';
      return status === 'completed' || status === 'cancelled';
    });
    
    return completedItems;
  } catch (error) {
    console.error('Error fetching completed maintenance:', error);
    return [];
  }
};

const updateMaintenanceStatus = async (id: string, status: string): Promise<void> => {
  try {
    // Ensure proper case for the status value
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    await pb.collection('maintenance').update(id, { status: formattedStatus });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
};

const deleteMaintenance = async (id: string): Promise<void> => {
  try {
    await pb.collection('maintenance').delete(id);
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    throw error;
  }
};

const createMaintenance = async (data: CreateMaintenanceInput): Promise<void> => {
  try {
    // Validate that all required fields are present
    if (!data.title || !data.description || !data.start_time || !data.end_time || 
        !data.affected || !data.priority || !data.status || !data.field) {
      throw new Error("Missing required fields for maintenance creation");
    }
    
    // Format the payload according to API requirements
    const payload = {
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      affected: data.affected,
      priority: data.priority.charAt(0).toUpperCase() + data.priority.slice(1),
      status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
      field: data.field.charAt(0).toUpperCase() + data.field.slice(1),
      created_by: data.created_by,
      notify_subscribers: data.notify_subscribers,
      assigned_users: data.assigned_users || "",
      notification_channel_id: data.notification_channel_id || "",
    };
    
    await pb.collection('maintenance').create(payload);
  } catch (error) {
    console.error('Error creating maintenance:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
};

export const maintenanceService = {
  getApiUrl,
  getMaintenanceRecords,
  getUpcomingMaintenance,
  getOngoingMaintenance,
  getCompletedMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
  createMaintenance,
};

// No need to re-export types here as they are now imported from maintenance.types.ts
