
import { User } from '@/services/userService';
import { format } from 'date-fns';

// Helper function to get user initials
export const getUserInitials = (user: User): string => {
  if (user.full_name) {
    const nameParts = user.full_name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.full_name.substring(0, 2).toUpperCase();
  }
  return user.username.substring(0, 2).toUpperCase();
};

// Format date helper
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'PPp');
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return dateStr;
  }
};

// Get affected systems helper
export const getAffectedSystemsArray = (systems?: string) => {
  if (!systems) return [];
  return systems.split(',').map(system => system.trim()).filter(Boolean);
};
