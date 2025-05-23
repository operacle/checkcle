
import { generatePdf } from './generator';
import { MaintenanceItem } from '../../types/maintenance.types';

/**
 * Generate and download PDF for maintenance report
 */
export const generateMaintenancePDF = async (maintenance: MaintenanceItem): Promise<string> => {
  try {
    const filename = await generatePdf(maintenance);
    return filename;
  } catch (error) {
    console.error("Error in generateMaintenancePDF:", error);
    throw error;
  }
};
