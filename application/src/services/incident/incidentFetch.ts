
import { pb } from '@/lib/pocketbase';
import { IncidentItem } from './types';
import { normalizeFetchedItem } from './incidentUtils';
import { updateCache, invalidateCache } from './incidentCache';

// Internal state variables instead of importing them
let incidentsCache: {
  data: IncidentItem[];
  timestamp: number;
} | null = null;
let pendingRequest: Promise<any> | null = null;
let isRequestInProgress = false;

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Check if cache is valid
export const isCacheValid = (): boolean => {
  const now = Date.now();
  return !!(incidentsCache && (now - incidentsCache.timestamp < CACHE_DURATION));
};

// Get all incidents with caching and error handling
export const getAllIncidents = async (forceRefresh = false): Promise<IncidentItem[]> => {
  // If a request is in progress, wait for it to complete rather than making a new one
  if (isRequestInProgress) {
    console.log('Request already in progress, waiting for completion');
    try {
      if (pendingRequest) {
        await pendingRequest;
      }
      return incidentsCache?.data || [];
    } catch (error) {
      console.error('Error in existing incidents request:', error);
      return incidentsCache?.data || [];
    }
  }
  
  // Use cache if available, not expired, and not forced refresh
  if (!forceRefresh && isCacheValid()) {
    console.log('Using cached incidents data from', new Date(incidentsCache!.timestamp).toLocaleTimeString());
    return incidentsCache!.data;
  }
  
  try {
    console.log('Fetching all incidents from API...');
    isRequestInProgress = true;
    
    // Implement timeout for the request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 20000); // Longer timeout (20s)
    });
    
    // Create the fetch promise with a unique request key to prevent conflicts
    const now = Date.now();
    const requestKey = `incidents-${now}`;
    const fetchPromise = pb.collection('incidents').getList(1, 100, {
      sort: '-created',
      requestKey,
      $cancelKey: requestKey,
    });
    
    // Store the pending request
    pendingRequest = Promise.race([fetchPromise, timeoutPromise]);
    
    // Race between fetch and timeout
    const result = await pendingRequest;
    
    // Clear request flags
    pendingRequest = null;
    isRequestInProgress = false;
    
    if (!result || !result.items) {
      console.warn('No incidents found in API response');
      return [];
    }
    
    const normalizedItems = result.items.map(normalizeFetchedItem);
    
    // Update cache
    updateCache(normalizedItems);
    
    console.log(`Fetched ${normalizedItems.length} incidents at ${new Date().toLocaleTimeString()}`);
    return normalizedItems;
  } catch (error) {
    if ((error as any)?.isAbort) {
      console.log("Request aborted:", error);
      return incidentsCache?.data || [];
    }
    
    console.error('Error fetching incidents:', error);
    
    // Clear states to allow retry
    pendingRequest = null;
    isRequestInProgress = false;
    
    // Improve error message
    if (error instanceof Error) {
      throw new Error(`Failed to fetch incidents: ${error.message}`);
    }
    
    // Still return cached data even on error
    if (incidentsCache) {
      console.log('Returning stale cached data after error');
      return incidentsCache.data;
    }
    
    return [];
  }
};

// Get incident by id
export const getIncidentById = async (id: string): Promise<IncidentItem | null> => {
  try {
    console.log(`Fetching incident with ID: ${id}`);
    
    // First check if the incident exists in the cache
    if (isCacheValid() && incidentsCache) {
      const cachedIncident = incidentsCache.data.find(incident => incident.id === id);
      if (cachedIncident) {
        console.log('Incident found in cache');
        return cachedIncident;
      }
    }
    
    // If not in cache, fetch from API
    const result = await pb.collection('incidents').getOne(id);
    
    if (!result) {
      console.warn(`No incident found with ID: ${id}`);
      return null;
    }
    
    const normalizedIncident = normalizeFetchedItem(result);
    return normalizedIncident;
    
  } catch (error) {
    console.error(`Error fetching incident with ID ${id}:`, error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to fetch incident: ${error.message}`);
    }
    
    return null;
  }
};
