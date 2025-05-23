
import { pb } from '@/lib/pocketbase';
import { CreateIncidentInput, IncidentItem } from './types';
import { formatStatus } from './incidentUtils';
import { invalidateCache } from './incidentCache';

// Update incident status
export const updateIncidentStatus = async (id: string, status: string): Promise<void> => {
  try {
    const formattedStatus = formatStatus(status);
    console.log(`Updating incident ${id} status to ${status} (formatted: ${formattedStatus})`);
    
    // Update both status and impact_status fields
    await pb.collection('incidents').update(id, { 
      status: formattedStatus,
      impact_status: status.toLowerCase(), // Set impact_status to the lowercase status value
      ...(status.toLowerCase() === 'resolved' ? { resolution_time: new Date().toISOString() } : {})
    });
    
    // Invalidate cache after update
    invalidateCache();
    
    console.log(`Incident ${id} status updated successfully to ${status}`);
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

// Delete incident
export const deleteIncident = async (id: string): Promise<void> => {
  try {
    await pb.collection('incidents').delete(id);
    
    // Invalidate cache after deletion
    invalidateCache();
    
    console.log(`Incident ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting incident:', error);
    throw error;
  }
};

// Create incident
export const createIncident = async (data: CreateIncidentInput): Promise<void> => {
  try {
    // Format the payload according to API requirements
    const payload = {
      title: data.title,
      description: data.description,
      status: formatStatus(data.status),
      impact_status: data.status.toLowerCase(),
      // Use lowercase for impact and priority to match API expectations
      impact: data.impact.toLowerCase(),
      affected_systems: data.affected_systems,
      priority: data.priority.toLowerCase(),
      service_id: data.service_id || '',
      assigned_to: data.assigned_to || '', // Direct user ID assignment
      root_cause: data.root_cause || '',
      resolution_steps: data.resolution_steps || '',
      lessons_learned: data.lessons_learned || '',
      timestamp: data.timestamp || new Date().toISOString(),
      created_by: data.created_by,
      resolution_time: data.status.toLowerCase() === 'resolved' ? new Date().toISOString() : null,
    };
    
    console.log('Creating new incident with payload:', payload);
    await pb.collection('incidents').create(payload);
    
    // Invalidate cache after create
    invalidateCache();
    
    console.log('Incident created successfully');
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

// Update incident
export const updateIncident = async (id: string, data: Partial<IncidentItem>): Promise<void> => {
  try {
    console.log(`Updating incident ${id} with:`, data);
    
    // Make sure impact and priority are lowercase
    const payload = {
      ...data,
      impact: data.impact?.toLowerCase(),
      priority: data.priority?.toLowerCase(),
      status: data.status ? formatStatus(data.status) : undefined,
      impact_status: data.status ? data.status.toLowerCase() : undefined,
      ...(data.status?.toLowerCase() === 'resolved' && !data.resolution_time 
        ? { resolution_time: new Date().toISOString() } 
        : {})
    };
    
    console.log("Final payload for update:", payload);
    await pb.collection('incidents').update(id, payload);
    
    // Invalidate cache after update
    invalidateCache();
    
    console.log(`Incident ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating incident:', error);
    throw error;
  }
};
