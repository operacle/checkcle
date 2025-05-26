
import { pb } from '@/lib/pocketbase';
import { MaintenanceItem } from '../../types/maintenance.types';
import { normalizeMaintenanceItem } from '../maintenanceUtils';
import { isCacheValid, getCachedRecords, updateCache, clearCache } from './maintenanceCache';

// Request management
let currentRequest: Promise<MaintenanceItem[]> | null = null;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 30000; // 30 seconds minimum between requests

/**
 * Get all maintenance records from the API with strict request control
 */
export const fetchAllMaintenanceRecords = async (forceRefresh = false): Promise<MaintenanceItem[]> => {
  try {
    const now = Date.now();
    
    // If forced refresh, clear cache first
    if (forceRefresh) {
      clearCache();
    }
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && isCacheValid()) {
      return getCachedRecords() as MaintenanceItem[];
    }
    
    // Request deduplication: if a request is already in progress, wait for it
    if (currentRequest) {
      return await currentRequest;
    }
    
    // Strict rate limiting - prevent requests too close together (unless forced)
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL && !forceRefresh) {
      return getCachedRecords() || [];
    }
    
    lastRequestTime = now;
    
    // Create the request promise
    currentRequest = performRequest(now);
    
    try {
      const result = await currentRequest;
      return result;
    } finally {
      currentRequest = null; // Clear the current request
    }
    
  } catch (error) {
    currentRequest = null; // Clear the current request on error
    
    console.error('Error fetching maintenance records:', error);
    
    // Return cached data on error if available
    return getCachedRecords() || [];
  }
};

/**
 * Perform the actual API request
 */
const performRequest = async (timestamp: number): Promise<MaintenanceItem[]> => {
  // Create abort controller for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const result = await pb.collection('maintenance').getList(1, 200, {
      sort: '-created',
      requestKey: `maintenance-${timestamp}`,
      $cancelKey: `maintenance-fetch-${timestamp}`,
      expand: 'assigned_users',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!result || !result.items || result.items.length === 0) {
      const emptyData: MaintenanceItem[] = [];
      updateCache(emptyData, timestamp);
      return emptyData;
    }
    
    // Process and normalize data
    const normalizedData = result.items.map(item => normalizeMaintenanceItem(item));
    
    // Update cache
    updateCache(normalizedData, timestamp);
    
    return normalizedData;
    
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};