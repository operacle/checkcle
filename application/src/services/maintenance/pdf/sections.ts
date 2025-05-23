
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MaintenanceItem } from '../../types/maintenance.types';
import { formatDate, calculateDuration } from './utils';

/**
 * Add description section to the PDF
 */
export const addDescriptionSection = (doc: jsPDF, maintenance: MaintenanceItem, yPos: number): number => {
  // Add section title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175); // Blue-800 color for headings
  doc.text('Description', 15, yPos);
  
  // Draw a line under the heading
  doc.setDrawColor(30, 64, 175); // Blue-800
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 2, 195, yPos + 2);
  
  // Handle multi-line description with word wrapping
  const description = maintenance.description || 'No description provided';
  const splitDescription = doc.splitTextToSize(description, 180);
  
  // Add description text
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Reset text color
  doc.text(splitDescription, 15, yPos + 10);
  
  // Return new Y position after the description text
  return yPos + 15 + (splitDescription.length * 5);
};

/**
 * Add schedule information section to the PDF
 */
export const addScheduleSection = (doc: jsPDF, maintenance: MaintenanceItem, yPos: number): number => {
  // Add section title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.text('Schedule Information', 15, yPos);
  
  // Draw a line under the heading
  doc.setDrawColor(30, 64, 175); // Blue-800
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 2, 195, yPos + 2);
  
  // Create schedule data table
  autoTable(doc, {
    startY: yPos + 10,
    head: [['Start Time', 'End Time', 'Duration']],
    body: [
      [
        formatDate(maintenance.start_time),
        formatDate(maintenance.end_time),
        calculateDuration(maintenance.start_time, maintenance.end_time)
      ]
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [30, 64, 175], // Blue-800
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: 15, right: 15 }
  });
  
  // Return next Y position
  return (doc as any).lastAutoTable.finalY + 15;
};

/**
 * Add affected services section to the PDF
 */
export const addAffectedServicesSection = (doc: jsPDF, maintenance: MaintenanceItem, yPos: number): number => {
  // Add section title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.text('Affected Services', 15, yPos);
  
  // Draw a line under the heading
  doc.setDrawColor(30, 64, 175); // Blue-800
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 2, 195, yPos + 2);
  
  // Safely handle affected services string
  const affectedServices = typeof maintenance.affected === 'string' && maintenance.affected.trim() !== ''
    ? maintenance.affected.split(',').map(item => [item.trim()])
    : [];
  
  if (affectedServices.length > 0) {
    autoTable(doc, {
      startY: yPos + 10,
      head: [['Service Name']],
      body: affectedServices,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175], // Blue-800
        textColor: 255,
        fontStyle: 'bold'
      },
      margin: { left: 15, right: 15 }
    });
    return (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('No affected services specified', 15, yPos + 10);
    return yPos + 25;
  }
};

/**
 * Add personnel information section to the PDF
 */
export const addPersonnelSection = (doc: jsPDF, maintenance: MaintenanceItem, yPos: number): number => {
  // Add section title
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.text('Personnel Information', 15, yPos);
  
  // Draw a line under the heading
  doc.setDrawColor(30, 64, 175); // Blue-800
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 2, 195, yPos + 2);
  
  // Process assigned users for the table safely
  let assignedUsersText = 'None';
  if (maintenance.assigned_users) {
    // Handle both string and array formats for assigned_users
    const assignedUsersList = Array.isArray(maintenance.assigned_users)
      ? maintenance.assigned_users
      : (typeof maintenance.assigned_users === 'string' 
          ? maintenance.assigned_users.split(',').map(item => item.trim())
          : []);
    
    assignedUsersText = assignedUsersList.length > 0 
      ? assignedUsersList.join(', ') 
      : 'None';
  }
  
  // Create personnel data table
  autoTable(doc, {
    startY: yPos + 10,
    head: [['Created By', 'Assigned Personnel', 'Notifications']],
    body: [
      [
        maintenance.created_by || 'Not specified',
        assignedUsersText,
        maintenance.notify_subscribers === 'yes' ? 'Enabled' : 'Disabled'
      ]
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [30, 64, 175], // Blue-800
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: 15, right: 15 }
  });
  
  // Return next Y position
  return (doc as any).lastAutoTable.finalY + 15;
};
