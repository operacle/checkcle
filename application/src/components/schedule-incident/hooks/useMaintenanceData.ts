
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { maintenanceService, MaintenanceItem } from '@/services/maintenance';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseMaintenanceDataProps {
  refreshTrigger?: number;
}

export const useMaintenanceData = ({ refreshTrigger = 0 }: UseMaintenanceDataProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allMaintenanceData, setAllMaintenanceData] = useState<MaintenanceItem[]>([]);
  const [filter, setFilter] = useState("upcoming");
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Refs for cleanup and request management
  const mountedRef = useRef(true);
  const currentRequestRef = useRef<Promise<void> | null>(null);

  // Memoize categorized data to prevent unnecessary recalculations
  const categorizedData = useMemo(() => {
    if (!allMaintenanceData.length) return { upcoming: [], ongoing: [], completed: [] };
    
    const currentDate = new Date();
    const upcoming: MaintenanceItem[] = [];
    const ongoing: MaintenanceItem[] = [];
    const completed: MaintenanceItem[] = [];
    
    allMaintenanceData.forEach(item => {
      const status = item.status?.toLowerCase() || '';
      const startTime = new Date(item.start_time);
      const endTime = new Date(item.end_time);
      
      if (status === 'completed' || status === 'cancelled') {
        completed.push(item);
      } else if (status === 'in_progress' || 
                (status === 'scheduled' && startTime <= currentDate && endTime >= currentDate)) {
        ongoing.push(item);
      } else if (status === 'scheduled' && startTime > currentDate) {
        upcoming.push(item);
      } else {
        // Default case: treat as upcoming if we can't determine
        upcoming.push(item);
      }
    });
    
    return { upcoming, ongoing, completed };
  }, [allMaintenanceData]);

  // Simple fetch function - only called when explicitly requested
  const fetchMaintenanceData = useCallback(async (force = false) => {
    // Check if component is still mounted
    if (!mountedRef.current) return;
    
    // Prevent duplicate requests
    if (currentRequestRef.current) {
      console.log("Request already in progress, waiting...");
      await currentRequestRef.current;
      return;
    }
    
    // Only show loading state for initial load or forced refresh
    if (!initialized || force) {
      setLoading(true);
    }
    
    setError(null);
    
    const requestPromise = (async () => {
      try {
        console.log("Fetching maintenance data...", force ? "(forced)" : "");
        const data = await maintenanceService.getMaintenanceRecords();
        
        // Check if component is still mounted before updating state
        if (!mountedRef.current) return;
        
        console.log(`Fetched ${data.length} maintenance records`);
        
        // Update state with fetched data
        setAllMaintenanceData(data);
        setInitialized(true);
        
        // Clear any previous error
        if (error) {
          setError(null);
        }
        
      } catch (err) {
        console.error('Error fetching maintenance data:', err);
        
        // Only update error state if component is still mounted
        if (!mountedRef.current) return;
        
        const errorMessage = 'Failed to load maintenance data. Please try again.';
        setError(errorMessage);
        
        // Show toast for errors
        toast({
          title: t('error'),
          description: t('errorFetchingMaintenanceData'),
          variant: 'destructive',
        });
      } finally {
        // Only update loading state if component is still mounted
        if (mountedRef.current) {
          setLoading(false);
        }
        currentRequestRef.current = null;
      }
    })();

    currentRequestRef.current = requestPromise;
    await requestPromise;
  }, [t, toast, error, initialized]);

  // Initial fetch on mount - NO AUTOMATIC POLLING
  useEffect(() => {
    console.log("useMaintenanceData hook mounted, fetching initial data");
    mountedRef.current = true;
    
    // Only fetch initial data, no polling
    fetchMaintenanceData(true);
    
    return () => {
      mountedRef.current = false;
      currentRequestRef.current = null;
    };
  }, []); // Remove fetchMaintenanceData from dependencies to prevent re-runs

  // Handle refresh trigger changes - ONLY when explicitly triggered
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("Manual refresh triggered, forcing data fetch");
      fetchMaintenanceData(true); // Force refresh to bypass cache
    }
  }, [refreshTrigger, fetchMaintenanceData]);

  // Get filtered data based on current tab
  const maintenanceData = useMemo(() => {
    if (!initialized) return [];
    return categorizedData[filter as keyof typeof categorizedData] || [];
  }, [filter, categorizedData, initialized]);

  // Calculate overview stats with memoization
  const overviewStats = useMemo(() => {
    const { upcoming, ongoing, completed } = categorizedData;
    
    // Calculate total hours more efficiently
    const calculateTotalHours = (items: MaintenanceItem[]) => {
      return items.reduce((total, item) => {
        try {
          const start = new Date(item.start_time).getTime();
          const end = new Date(item.end_time).getTime();
          const durationHours = (end - start) / (1000 * 60 * 60);
          return total + (isNaN(durationHours) ? 0 : durationHours);
        } catch (e) {
          return total;
        }
      }, 0).toFixed(1);
    };
    
    return {
      upcoming: upcoming.length,
      ongoing: ongoing.length,
      completed: completed.length,
      totalDuration: calculateTotalHours([...upcoming, ...ongoing]),
    };
  }, [categorizedData]);

  const isEmpty = !loading && maintenanceData.length === 0 && initialized;

  return {
    loading,
    filter,
    setFilter,
    maintenanceData,
    overviewStats,
    fetchMaintenanceData,
    isEmpty,
    error,
    initialized,
  };
};