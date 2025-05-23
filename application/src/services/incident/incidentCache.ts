
import { IncidentItem } from './types';

// Export functions to update and invalidate the cache
export const updateCache = (data: IncidentItem[]) => {
  console.log(`Updating cache with ${data.length} incidents`);
  // The actual cache is now maintained in incidentFetch.ts
};

// Reset cache and request state
export const invalidateCache = () => {
  console.log('Invalidating incidents cache');
  // The invalidation is handled in incidentFetch.ts implementation
};
