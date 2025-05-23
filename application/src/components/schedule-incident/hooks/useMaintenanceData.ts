
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [lastFetchTime, setLastFetchTime] = useState(0);

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

  // Optimized fetch function with improved debouncing
  const fetchMaintenanceData = useCallback(async (force = false) => {
    // Prevent excessive fetching with improved debounce logic
    const now = Date.now();
    if (!force && now - lastFetchTime < 10000 && lastFetchTime > 0 && initialized) {
      console.log("Skipping fetch - recently fetched (within 10s)");
      return;
    }
    
    // Only show loading state for initial load, not refreshes
    if (!initialized) {
      setLoading(true);
    }
    
    setError(null);
    setLastFetchTime(now);
    
    try {
      console.log("Fetching maintenance data from service...");
      const data = await maintenanceService.getMaintenanceRecords();
      console.log("Fetched maintenance data, count:", data.length);
      
      // Log a sample of the first item's assigned_users for debugging
      if (data.length > 0) {
        console.log("Sample maintenance item assigned_users:", data[0].id, data[0].assigned_users);
      }
      
      // Update state with fetched data
      setAllMaintenanceData(data);
      setInitialized(true);
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError('Failed to load maintenance data');
      toast({
        title: t('error'),
        description: t('errorFetchingMaintenanceData'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast, lastFetchTime, initialized]);

  // Initial fetch on mount with proper cleanup
  useEffect(() => {
    console.log("useMaintenanceData hook mounted, fetching data");
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        await fetchMaintenanceData(true);
      } catch (err) {
        console.error("Error in initial fetch:", err);
      }
    };
    
    fetchData();
    
    // Set up polling with longer interval (5 minutes instead of 3)
    const intervalId = setInterval(() => {
      if (isMounted) fetchMaintenanceData(false);
    }, 300000); // 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchMaintenanceData]);

  // Handle refresh trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("Refresh trigger changed, forcing data fetch");
      fetchMaintenanceData(true);
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
