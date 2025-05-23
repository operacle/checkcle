
import { pb } from '@/lib/pocketbase';
import { IncidentItem } from './types';

// Helper function to get the API URL
export const getApiUrl = (): string => {
  try {
    return pb.baseUrl;
  } catch (error) {
    console.error('Error getting API URL:', error);
    return '';
  }
};

// Normalize fetched items to ensure consistent data structure
export const normalizeFetchedItem = (item: any): IncidentItem => {
  return {
    ...item,
    affected_systems: item.affected_systems || '',
    status: item.impact_status || item.status || 'Investigating',
    impact: item.impact || 'Low',
    priority: item.priority || 'Low',
  } as IncidentItem;
};

// Format status with first letter capitalized
export const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
