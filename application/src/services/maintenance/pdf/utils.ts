
import { format } from 'date-fns';

// Font configuration for the PDF
export const fonts = {
  normal: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique',
};

// Helper function to format dates
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPp');
  } catch (e) {
    return dateString || 'N/A';
  }
};

// Helper function to calculate duration between two dates
export const calculateDuration = (start: string, end: string): string => {
  try {
    if (!start || !end) return 'N/A';
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return 'N/A';
    }
    
    const durationMs = endTime.getTime() - startTime.getTime();
    
    // Check for negative duration
    if (durationMs < 0) {
      return 'Invalid date range';
    }
    
    // Convert to hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return "N/A";
  }
};
