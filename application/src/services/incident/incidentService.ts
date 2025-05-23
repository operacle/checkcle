
import { CreateIncidentInput, IncidentItem, UpdateIncidentInput } from './types';
import { createIncident, updateIncident, updateIncidentStatus, deleteIncident } from './incidentOperations';
import { getAllIncidents, getIncidentById } from './incidentFetch';
import { generateIncidentPDF } from './incidentPdfService';

export const incidentService = {
  // Fetch operations
  getAllIncidents,
  getIncidentById,
  
  // CRUD operations
  createIncident,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
  
  // PDF operations
  generateIncidentPDF,
};

export default incidentService;
