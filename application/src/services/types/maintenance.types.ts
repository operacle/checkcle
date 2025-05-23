
export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  affected: string;
  priority: string;
  status: string;
  field: string;
  created_by: string;
  assigned_users: string[] | string; // Can be array of user IDs or string (JSON or comma-separated)
  notify_subscribers: string;
  notification_channel_id?: string;
  notification_id?: string;
  operational_status_id?: string;
  created: string;
  updated: string;
  notification_channel_name?: string; // Add this optional property for UI display purposes
  expand?: {
    assigned_users?: any[]; // For expanded user data
  };
}

export interface CreateMaintenanceInput {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  affected: string;
  priority: string;
  status: string;
  field: string;
  created_by: string;
  assigned_users: string[] | string; // Can be array of user IDs or string representation
  notify_subscribers: string;
  notification_channel_id?: string;
  notification_id?: string; // Added to ensure it's included in create operations
}

export interface MaintenanceFilter {
  status?: string;
  priority?: string;
  field?: string;
}