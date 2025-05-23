
import { MaintenanceItem } from '../types/maintenance.types';

// Normalize maintenance item data from PocketBase to our expected format
export const normalizeMaintenanceItem = (item: any): MaintenanceItem => {
  // Log the item to help debug
  console.log(`Normalizing maintenance item ${item.id}, assigned_users:`, item.assigned_users);
  
  // Handle assigned_users, ensuring it's always an array
  let assignedUsers: string[] = [];
  
  if (item.assigned_users) {
    if (Array.isArray(item.assigned_users)) {
      // If it's already an array, use it
      assignedUsers = item.assigned_users;
      console.log(`Maintenance ${item.id} assigned_users is an array:`, assignedUsers);
    } else if (typeof item.assigned_users === 'string' && item.assigned_users.trim() !== '') {
      // If it's a string, split it by comma
      assignedUsers = item.assigned_users.split(',').filter((id: string) => id.trim() !== '').map((id: string) => id.trim());
      console.log(`Maintenance ${item.id} converted assigned_users string to array:`, assignedUsers);
    }
  }
  
  // Include expand data if available
  const expandData = item.expand ? {
    expand: {
      ...item.expand
    }
  } : {};

  return {
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    start_time: item.start_time || '',
    end_time: item.end_time || '',
    affected: item.affected || '',
    priority: item.priority || 'medium',
    status: item.status || 'scheduled',
    field: item.field || 'minor',
    created_by: item.created_by || '',
    assigned_users: assignedUsers,
    notify_subscribers: item.notify_subscribers || 'no',
    notification_channel_id: item.notification_channel_id || '',
    notification_id: item.notification_id || '',
    operational_status_id: item.operational_status_id || '',
    created: item.created || '',
    updated: item.updated || '',
    ...expandData
  };
};

// Utility function to convert maintenance status to display format
export const formatMaintenanceStatus = (status: string): string => {
  if (!status) return 'Unknown';
  
  // Convert to lowercase and replace underscores with spaces
  const formattedStatus = status.toLowerCase().replace('_', ' ');
  
  // Capitalize first letter
  return formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1);
};

// Get appropriate color class based on status
export const getStatusColorClass = (status: string): string => {
  const statusLower = status?.toLowerCase() || '';
  
  switch (statusLower) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'in_progress':
    case 'in progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Get appropriate badge variant based on priority
export const getPriorityVariant = (priority: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
  const priorityLower = priority?.toLowerCase() || '';
  
  switch (priorityLower) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Categorize maintenance records into upcoming, ongoing, and completed
export const categorizeMaintenance = (maintenanceRecords: MaintenanceItem[]) => {
  const currentDate = new Date();
  const upcoming: MaintenanceItem[] = [];
  const ongoing: MaintenanceItem[] = [];
  const completed: MaintenanceItem[] = [];
  
  maintenanceRecords.forEach(item => {
    const status = item.status?.toLowerCase() || '';
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time);
    
    if (status === 'completed' || status === 'cancelled') {
      completed.push(item);
    } else if (status === 'in_progress' || 
              (status === 'scheduled' && startTime <= currentDate && endTime >= currentDate)) {
      ongoing.push(item);
    } else if (status === 'scheduled' && startTime > currentDate) {
      upcoming.push(item);
    } else {
      // Default case: treat as upcoming if we can't determine
      upcoming.push(item);
    }
  });
  
  return { upcoming, ongoing, completed };
};
