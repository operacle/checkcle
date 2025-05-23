
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

// Helper function to capitalize first letter
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

