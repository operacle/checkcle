
import { pb, getCurrentEndpoint } from '@/lib/pocketbase';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';

export const statusPageComponentsService = {
  async getStatusPageComponents(): Promise<StatusPageComponentRecord[]> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/status_page_components/records`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.items || [];
    } catch (error) {
      console.error('Error fetching status page components:', error);
      throw error;
    }
  },

  async getStatusPageComponentsByOperationalId(operationalStatusId: string): Promise<StatusPageComponentRecord[]> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/status_page_components/records?filter=(operational_status_id='${operationalStatusId}')`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.items || [];
    } catch (error) {
      console.error('Error fetching status page components by operational ID:', error);
      throw error;
    }
  },

  async createStatusPageComponent(data: {
    operational_status_id: string;
    name: string;
    description: string;
    service_id: string;
    server_id: string;
    display_order: number;
  }): Promise<StatusPageComponentRecord> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      console.log('Creating status page component with data:', data);

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/status_page_components/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Created component:', result);
      return result;
    } catch (error) {
      console.error('Error creating status page component:', error);
      throw error;
    }
  },

  async deleteStatusPageComponent(id: string): Promise<void> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/status_page_components/records/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting status page component:', error);
      throw error;
    }
  }
};