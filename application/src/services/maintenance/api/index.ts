
// Re-export all maintenance API functions from their respective modules
export { clearCache as clearMaintenanceCache } from './maintenanceCache';
export { fetchAllMaintenanceRecords } from './maintenanceFetch';
export { 
  updateMaintenanceStatus,
  updateMaintenance,
  deleteMaintenance,
  createMaintenance
} from './maintenanceOperations';
