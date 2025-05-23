
// Define the type for incident item
export type IncidentItem = {
  id: string;
  service_id?: string;
  timestamp?: string;
  description: string;
  assigned_to?: string;
  resolution_time?: string;
  impact: string;
  affected_systems: string;
  root_cause?: string;
  resolution_steps?: string;
  lessons_learned?: string;
  operational_status_id?: string;
  server_id?: string;
  priority: string;
  status: string;
  impact_status?: string;
  created: string;
  updated: string;
  category?: string;
  title: string; 
};

// Define the input type for creating an incident
export type CreateIncidentInput = {
  title: string;
  description: string;
  status: string;
  impact: string;
  affected_systems: string;
  priority: string;
  service_id?: string;
  assigned_to?: string;
  root_cause?: string;
  resolution_steps?: string;
  lessons_learned?: string;
  timestamp?: string;
  created_by: string;
};

// Define the input type for updating an incident
export type UpdateIncidentInput = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  impact?: string;
  affected_systems?: string;
  priority?: string;
  service_id?: string;
  assigned_to?: string;
  root_cause?: string;
  resolution_steps?: string;
  lessons_learned?: string;
};
