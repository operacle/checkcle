
import { getCurrentEndpoint } from '@/lib/pocketbase';
import { MaintenanceItem, CreateMaintenanceInput } from '../types/maintenance.types';
import { categorizeMaintenance } from './maintenanceUtils';
import { 
  fetchAllMaintenanceRecords, 
  updateMaintenanceStatus,
  updateMaintenance,
  deleteMaintenance,
  createMaintenance as createMaintenanceRecord,
  clearMaintenanceCache
} from './api';

// Helper function to get the API URL
const getApiUrl = (): string => {
  return getCurrentEndpoint();
};

// Get all maintenance records with performance optimizations
const getMaintenanceRecords = async (): Promise<MaintenanceItem[]> => {
  return await fetchAllMaintenanceRecords();
};

// Get upcoming maintenance with caching
const getUpcomingMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    const { upcoming } = categorizeMaintenance(allRecords);
    return upcoming;
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    return [];
  }
};

// Get ongoing maintenance with caching
const getOngoingMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    const { ongoing } = categorizeMaintenance(allRecords);
    return ongoing;
  } catch (error) {
    console.error('Error fetching ongoing maintenance:', error);
    return [];
  }
};

// Get completed maintenance with caching
const getCompletedMaintenance = async (): Promise<MaintenanceItem[]> => {
  try {
    const allRecords = await getMaintenanceRecords();
    const { completed } = categorizeMaintenance(allRecords);
    return completed;
  } catch (error) {
    console.error('Error fetching completed maintenance:', error);
    return [];
  }
};

// Create a new maintenance record
const createMaintenance = async (data: CreateMaintenanceInput): Promise<void> => {
  await createMaintenanceRecord(data);
  clearMaintenanceCache(); // Force cache refresh after creation
  console.log('Maintenance created and cache cleared');
};

// Update an existing maintenance record
const updateMaintenanceRecord = async (id: string, data: Partial<MaintenanceItem>): Promise<void> => {
  await updateMaintenance(id, data);
  clearMaintenanceCache(); // Force cache refresh after update
  console.log('Maintenance updated and cache cleared');
};

// Refresh cache manually
const refreshMaintenanceData = (): void => {
  clearMaintenanceCache();
};

// Export all functions as the maintenanceService object
export const maintenanceService = {
  getApiUrl,
  getMaintenanceRecords,
  getUpcomingMaintenance,
  getOngoingMaintenance,
  getCompletedMaintenance,
  updateMaintenanceStatus,
  updateMaintenance: updateMaintenanceRecord,
  deleteMaintenance,
  createMaintenance,
  refreshMaintenanceData
};

// Re-export types for convenience
export type { MaintenanceItem, CreateMaintenanceInput };