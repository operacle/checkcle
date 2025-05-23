
import { pb } from '@/lib/pocketbase';
import { MaintenanceItem } from '../../types/maintenance.types';
import { normalizeMaintenanceItem } from '../maintenanceUtils';
import { isCacheValid, getCachedRecords, updateCache } from './maintenanceCache';

/**
 * Get all maintenance records from the API with optimized caching
 */
export const fetchAllMaintenanceRecords = async (forceRefresh = false): Promise<MaintenanceItem[]> => {
  try {
    const now = Date.now();
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && isCacheValid()) {
      return getCachedRecords() as MaintenanceItem[];
    }
    
    // Use a unique requestKey to prevent caching issues
    const timestamp = now;
    
    // Increase items per page and use fields parameter to fetch only needed data
    // Also expand the assigned_users relation to get user details
    const result = await pb.collection('maintenance').getList(1, 200, {
      sort: '-created',
      requestKey: `maintenance-${timestamp}`,
      $cancelKey: `maintenance-fetch-${timestamp}`,
      expand: 'assigned_users', // Expand the relation to get user details
    });
    
    if (!result || !result.items || result.items.length === 0) {
      const emptyData: MaintenanceItem[] = [];
      updateCache(emptyData, now);
      return emptyData;
    }
    
    // Process and normalize data
    const normalizedData = result.items.map(item => {
      console.log("Processing maintenance item:", item.id);
      console.log("Item assigned_users:", item.assigned_users);
      console.log("Notification channel:", item.notification_channel_id);
      return normalizeMaintenanceItem(item);
    });
    
    // Update cache
    updateCache(normalizedData, now);
    
    return normalizedData;
  } catch (error) {
    // Handle abort errors gracefully without console errors
    if ((error as any)?.isAbort) {
      console.log("Request aborted:", error);
      return getCachedRecords() || [];
    }
    
    console.error('Error fetching maintenance records:', error);
    return getCachedRecords() || [];
  }
};
