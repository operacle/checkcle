
import { MaintenanceItem } from '../../types/maintenance.types';

// Cache management for maintenance records

// Cache for maintenance records
let cachedMaintenanceRecords: MaintenanceItem[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_EXPIRY_MS = 60000; // 1 minute cache expiry

/**
 * Check if cache is valid and can be used
 */
export const isCacheValid = (): boolean => {
  const now = Date.now();
  return !!(cachedMaintenanceRecords && now - lastFetchTimestamp < CACHE_EXPIRY_MS);
};

/**
 * Get cached maintenance records if available
 */
export const getCachedRecords = () => {
  if (cachedMaintenanceRecords) {
    console.log("Using cached maintenance records", cachedMaintenanceRecords.length);
    return [...cachedMaintenanceRecords]; // Return a copy to prevent mutation
  }
  return null;
};

/**
 * Update cache with new data
 */
export const updateCache = (data: MaintenanceItem[], timestamp?: number): void => {
  cachedMaintenanceRecords = data;
  lastFetchTimestamp = timestamp || Date.now();
  console.log("Maintenance cache updated with", data.length, "records");
};

/**
 * Clear cache to force refresh
 */
export const clearCache = (): void => {
  cachedMaintenanceRecords = null;
  lastFetchTimestamp = 0;
  console.log("Maintenance cache cleared");
};
