
/**
 * Validation utilities for maintenance data
 */

/**
 * Validate status value to ensure it's one of the acceptable values
 */
export const validateStatus = (status: string): string => {
  // Convert to lowercase and replace spaces with underscore for consistency
  const formattedStatus = status.toLowerCase().replace(' ', '_');
  
  // Check if the status is one of the allowed values
  const allowedStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
  
  if (!allowedStatuses.includes(formattedStatus)) {
    console.warn(`Invalid status value: ${formattedStatus}. Using 'scheduled' as fallback.`);
    return 'scheduled';
  }
  
  return formattedStatus;
};

/**
 * Ensure assigned_users is properly formatted
 */
export const formatAssignedUsers = (assignedUsers: unknown): string => {
  // If it's already a JSON string, return it
  if (typeof assignedUsers === 'string' && (assignedUsers.startsWith('[') || assignedUsers === '')) {
    return assignedUsers;
  }
  
  // If it's an array, stringify it
  if (Array.isArray(assignedUsers)) {
    return JSON.stringify(assignedUsers);
  }
  
  // If it's a string but not JSON, convert it to array then stringify
  if (typeof assignedUsers === 'string') {
    const userArray = assignedUsers.trim() !== '' 
      ? assignedUsers.split(',').map(id => id.trim())
      : [];
    return JSON.stringify(userArray);
  }
  
  // Default to empty array
  return '[]';
};

/**
 * Process notification settings consistently
 */
export const processNotificationSettings = (
  notifySubscribers: string, 
  channelId?: string
): { notification_channel_id: string, notification_id: string } => {
  if (notifySubscribers !== 'yes' || !channelId) {
    return {
      notification_channel_id: '',
      notification_id: ''
    };
  }
  
  return {
    notification_channel_id: channelId,
    notification_id: channelId  // Set notification_id to match notification_channel_id
  };
};
