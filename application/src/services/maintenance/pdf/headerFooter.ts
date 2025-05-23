
import jsPDF from 'jspdf';
import { MaintenanceItem } from '../../types/maintenance.types';
import { format } from 'date-fns';

/**
 * Add header with title and branding to the maintenance PDF
 */
export const addHeader = (doc: jsPDF, maintenance: MaintenanceItem): void => {
  // Add colored header background
  doc.setFillColor(30, 64, 175); // Blue-800 color
  doc.rect(0, 0, 210, 35, 'F');
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255); // White text
  doc.text('Scheduled Maintenance Report', 15, 15);
  
  // Add maintenance title
  doc.setFontSize(12);
  doc.text(maintenance.title || 'Maintenance Report', 15, 22);
  
  // Add reference ID
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254); // Blue-100 text
  doc.text(`Reference ID: ${maintenance.id}`, 15, 28);
  
  // Add current date
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 140, 28, {
    align: 'right'
  });
  
  // Add status badge area below the header
  doc.setFillColor(249, 250, 251); // Gray-50
  doc.rect(0, 35, 210, 12, 'F');
  
  // Add status info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const statusText = `Status: ${maintenance.status || 'N/A'} | Priority: ${maintenance.priority || 'N/A'} | Impact: ${maintenance.field || 'N/A'}`;
  doc.text(statusText, 105, 43, { align: 'center' });
};

/**
 * Add footer to all pages of the PDF
 */
export const addFooter = (doc: jsPDF): void => {
  // Add footer with blue background
  doc.setFillColor(30, 64, 175); // Blue-800 for footer background
  doc.rect(0, 277, 210, 20, 'F');
  
  // Get total page count
  const totalPages = doc.getNumberOfPages();
  
  // Add footer to each page
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add page number
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255); // White text for page numbers
    doc.text(
      `Page ${i} of ${totalPages}`,
      195,
      10,
      { align: 'right' }
    );
    
    // Add footer text with white color
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255); // White text for footer
    doc.text(
      `Maintenance ID: ${i === 1 ? doc.getTextWidth('Maintenance ID: ') : ''}`,
      15,
      283
    );
    doc.text(
      `Generated on ${format(new Date(), 'PPP')}`,
      195,
      283,
      { align: 'right' }
    );
    doc.text(
      'This document is confidential and intended for internal use only.',
      105,
      290,
      { align: 'center' }
    );
  }
};
