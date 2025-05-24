
import { MaintenanceItem } from '../../types/maintenance.types';

// Cache management for maintenance records

// Cache for maintenance records
let cachedMaintenanceRecords: MaintenanceItem[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_EXPIRY_MS = 600000; // 10 minutes cache expiry (increased significantly)

/**
 * Check if cache is valid and can be used
 */
export const isCacheValid = (): boolean => {
  const now = Date.now();
  const isValid = !!(cachedMaintenanceRecords && now - lastFetchTimestamp < CACHE_EXPIRY_MS);
  
  // Minimal logging to reduce console spam
  if (isValid) {
    console.log("Using cached maintenance data");
  }
  
  return isValid;
};

/**
 * Get cached maintenance records if available
 */
export const getCachedRecords = () => {
  if (cachedMaintenanceRecords) {
    console.log("Returning cached maintenance records:", cachedMaintenanceRecords.length);
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

/**
 * Get cache statistics for debugging
 */
export const getCacheStats = () => {
  const now = Date.now();
  const cacheAge = lastFetchTimestamp ? now - lastFetchTimestamp : 0;
  const timeUntilExpiry = lastFetchTimestamp ? CACHE_EXPIRY_MS - cacheAge : 0;
  
  return {
    hasCache: !!cachedMaintenanceRecords,
    cacheSize: cachedMaintenanceRecords?.length || 0,
    cacheAge: Math.round(cacheAge / 1000), // in seconds
    timeUntilExpiry: Math.round(timeUntilExpiry / 1000), // in seconds
    isValid: isCacheValid()
  };
};