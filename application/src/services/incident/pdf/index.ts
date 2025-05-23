
import { generatePdf } from './generator';
import { IncidentItem } from '../types';

/**
 * Generate and download PDF for incident report
 */
export const generateIncidentPDF = async (incident: IncidentItem): Promise<void> => {
  await generatePdf(incident);
  return Promise.resolve();
};

