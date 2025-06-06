
import { pb, getCurrentEndpoint } from '@/lib/pocketbase';
import { OperationalPageRecord } from '@/types/operational.types';

export const operationalPageService = {
  async getOperationalPages(): Promise<OperationalPageRecord[]> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/operational_page/records`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.items || [];
    } catch (error) {
      console.error('Error fetching operational pages:', error);
      throw error;
    }
  },

  async getOperationalPage(id: string): Promise<OperationalPageRecord> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/operational_page/records/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching operational page:', error);
      throw error;
    }
  },

  async updateOperationalPage(id: string, data: Partial<OperationalPageRecord>): Promise<OperationalPageRecord> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/operational_page/records/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating operational page:', error);
      throw error;
    }
  },

  async createOperationalPage(data: Omit<OperationalPageRecord, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>): Promise<OperationalPageRecord> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/operational_page/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating operational page:', error);
      throw error;
    }
  },

  async deleteOperationalPage(id: string): Promise<void> {
    try {
      const authToken = pb.authStore.token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const baseUrl = getCurrentEndpoint();
      const response = await fetch(`${baseUrl}/api/collections/operational_page/records/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting operational page:', error);
      throw error;
    }
  }
};