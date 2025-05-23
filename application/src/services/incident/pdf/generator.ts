
import jsPDF from 'jspdf';
import { IncidentItem } from '../types';
import {
  addBasicInfoSection,
  addDescriptionSection,
  addAffectedSystemsSection,
  addRootCauseSection,
  addResolutionSection,
  addAssignmentSection,
  addLessonsLearnedSection
} from './sections';
import { addHeader, addFooter } from './headerFooter';

/**
 * Generate a PDF for an incident report
 */
export const generatePdf = async (incident: IncidentItem): Promise<string> => {
  // Validate incident data
  if (!incident?.id) {
    console.error('Invalid incident data for PDF generation');
    throw new Error('Invalid incident data');
  }
  
  try {
    // Create new PDF document with portrait orientation
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set title and filename
    const title = incident.title || `Incident Report #${incident.id}`;
    const filename = `incident-report-${incident.id}.pdf`;
    
    // Add metadata
    doc.setProperties({
      title: title,
      subject: 'Incident Report',
      author: 'ReamStack System',
      creator: 'ReamStack',
    });
    
    // Add header section
    let yPos = addHeader(doc, incident);
    
    // Add basic information section
    yPos = addBasicInfoSection(doc, incident, yPos);
    
    // Add description section
    yPos = addDescriptionSection(doc, incident, yPos);
    
    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add affected systems section
    yPos = addAffectedSystemsSection(doc, incident, yPos);
    
    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add root cause section
    yPos = addRootCauseSection(doc, incident, yPos);
    
    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add resolution steps section
    yPos = addResolutionSection(doc, incident, yPos);
    
    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add assignment section
    yPos = addAssignmentSection(doc, incident, yPos);
    
    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add lessons learned section if available
    addLessonsLearnedSection(doc, incident, yPos);
    
    // Add footer to all pages
    addFooter(doc);
    
    // Save the PDF
    doc.save(filename);
    
    console.log('PDF generated successfully:', filename);
    return filename;
  } catch (error) {
    console.error('Error generating incident PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

