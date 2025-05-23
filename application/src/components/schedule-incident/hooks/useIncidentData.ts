import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { incidentService, IncidentItem } from '@/services/incident';

interface UseIncidentDataProps {
  refreshTrigger?: number;
}

export const useIncidentData = ({ refreshTrigger = 0 }: UseIncidentDataProps) => {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [filter, setFilter] = useState("unresolved");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use a ref to prevent multiple simultaneous fetch requests
  const isFetchingRef = useRef(false);
  // Use a ref to track the refresh trigger
  const lastRefreshTriggerRef = useRef(refreshTrigger);
  
  // Simplified fetch function with improved controls to prevent duplicate calls
  const fetchIncidentData = useCallback(async (force = false) => {
    // Skip if already fetching
    if (isFetchingRef.current) {
      console.log('Already fetching data, skipping additional request');
      return;
    }
    
    // Skip if not forced and already initialized
    if (initialized && !force) {
      console.log('Data already initialized and no force refresh, skipping fetch');
      return;
    }
    
    // Set fetching flags
    isFetchingRef.current = true;
    
    if (!initialized || force) {
      setLoading(true);
    }
    
    if (force) {
      setIsRefreshing(true);
    }
    
    setError(null);
    
    try {
      console.log(`Fetching incident data (force=${force})`);
      const allIncidents = await incidentService.getAllIncidents(force);
      
      if (Array.isArray(allIncidents)) {
        setIncidents(allIncidents);
        console.log(`Successfully set ${allIncidents.length} incidents to state`);
      } else {
        setIncidents([]);
        console.warn('No incidents returned from service');
      }
      
      setInitialized(true);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching incident data:', error);
      setError('Failed to load incident data. Please try again later.');
      setIncidents([]);
      setInitialized(true);
      setLoading(false);
      setIsRefreshing(false);
    } finally {
      // Reset fetching flag after a slight delay to prevent rapid consecutive calls
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 500);
    }
  }, [initialized]);

  // Only fetch when component mounts or refreshTrigger changes
  useEffect(() => {
    // Skip if the refresh trigger hasn't changed (prevents duplicate effect calls)
    if (refreshTrigger === lastRefreshTriggerRef.current && initialized) {
      console.log('Refresh trigger unchanged, skipping fetch');
      return;
    }
    
    // Update last refresh trigger ref
    lastRefreshTriggerRef.current = refreshTrigger;
    
    // Create an abort controller for cleanup
    const abortController = new AbortController();
    let isMounted = true;
    
    console.log(`useIncidentData effect running, refreshTrigger: ${refreshTrigger}`);
    
    // Use a longer delay to ensure we don't trigger too many API calls
    const fetchTimer = setTimeout(() => {
      if (isMounted) {
        fetchIncidentData(refreshTrigger > 0);
      }
    }, 500); // Use a longer delay
    
    // Cleanup function to abort any in-flight requests and clear timers
    return () => {
      console.log('Cleaning up incident data fetch effect');
      isMounted = false;
      clearTimeout(fetchTimer);
      abortController.abort();
    };
  }, [fetchIncidentData, refreshTrigger, initialized]);

  // Filter the data based on the current filter
  const incidentData = useMemo(() => {
    if (!initialized || incidents.length === 0) return [];
    
    console.log(`Filtering incidents by: ${filter}`);
    
    if (filter === "unresolved") {
      return incidents.filter(item => {
        const status = (item.status || item.impact_status || '').toLowerCase();
        return status !== 'resolved';
      });
    } else if (filter === "resolved") {
      return incidents.filter(item => {
        const status = (item.status || item.impact_status || '').toLowerCase();
        return status === 'resolved';
      });
    }
    
    return [];
  }, [filter, incidents, initialized]);

  // Calculate stats for overview cards
  const overviewStats = useMemo(() => {
    if (!initialized || incidents.length === 0) {
      return {
        unresolved: 0,
        resolved: 0,
        critical: 0,
        highPriority: 0,
        avgResolutionTime: "0h"
      };
    }
    
    const unresolvedIncidents = incidents.filter(item => {
      const status = (item.status || item.impact_status || '').toLowerCase();
      return status !== 'resolved';
    });
    
    const resolvedIncidents = incidents.filter(item => {
      const status = (item.status || item.impact_status || '').toLowerCase();
      return status === 'resolved';
    });
    
    const criticalCount = unresolvedIncidents.filter(item => 
      (item.priority?.toLowerCase() === 'critical') || 
      (item.impact?.toLowerCase() === 'critical')
    ).length;
    
    const highPriorityCount = unresolvedIncidents.filter(item => 
      (item.priority?.toLowerCase() === 'high')
    ).length;
    
    let avgResolutionTime = "0h";
    if (resolvedIncidents.length > 0) {
      const totalHours = resolvedIncidents.reduce((total, item) => {
        if (!item.created || !item.resolution_time) return total;
        
        const createdAt = new Date(item.created).getTime();
        const resolvedAt = new Date(item.resolution_time).getTime();
        const durationHours = (resolvedAt - createdAt) / (1000 * 60 * 60);
        return isNaN(durationHours) ? total : total + durationHours;
      }, 0);
      
      avgResolutionTime = `${(totalHours / resolvedIncidents.length).toFixed(1)}h`;
    }
    
    return {
      unresolved: unresolvedIncidents.length,
      resolved: resolvedIncidents.length,
      critical: criticalCount,
      highPriority: highPriorityCount,
      avgResolutionTime
    };
  }, [incidents, initialized]);

  const isEmpty = !incidentData.length && initialized && !loading;

  return {
    filter,
    setFilter,
    incidentData,
    overviewStats,
    fetchIncidentData,
    isEmpty,
    error,
    loading,
    initialized,
    isRefreshing
  };
};
