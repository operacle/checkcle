
import React, { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UptimeStatusItem } from './uptime/UptimeStatusItem';
import { uptimeService } from '@/services/uptimeService';
import { UptimeData } from '@/types/service.types';
import {useLanguage} from "@/contexts/LanguageContext.tsx";

interface UptimeBarProps {
  uptime: number;
  status: string;
  serviceId: string;
  interval: number;
  serviceType?: string;
}

const UptimeBarComponent = ({ uptime, status, serviceId, interval, serviceType = "HTTP" }: UptimeBarProps) => {
	const { t } = useLanguage();
  // Calculate date range for last 20 checks with much more aggressive caching
  const endDate = useMemo(() => new Date(), []);
  const startDate = useMemo(() => {
    const start = new Date(endDate);
    start.setHours(start.getHours() - Math.max(interval * 20 / 3600, 24)); // At least 24 hours
    return start;
  }, [endDate, interval]);

  // Fetch uptime data with immediate display and background updates
  const { data: uptimeData = [] } = useQuery({
    queryKey: ['uptime-bar', serviceId, serviceType],
    queryFn: () => uptimeService.getUptimeHistory(serviceId, 20, startDate, endDate, serviceType),
    enabled: !!serviceId,
    staleTime: 300000, // Data stays fresh for 5 minutes - display immediately from cache
    gcTime: 900000, // Keep in cache for 15 minutes
    refetchInterval: 300000, // Reduced to 5 minute polling
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1, // Reduce retries for faster failure
    retryDelay: 1000, // Faster retry delay
    refetchIntervalInBackground: true, // Allow background updates
    placeholderData: (previousData) => previousData, // Keep showing previous data while refetching
  });

  // Memoize the uptime calculation to prevent unnecessary recalculations
  const { uptimePercentage, displayData } = useMemo(() => {
    if (!uptimeData || uptimeData.length === 0) {
      return {
        uptimePercentage: uptime || 0,
        displayData: []
      };
    }

    // Calculate uptime percentage from actual data
    const upCount = uptimeData.filter(item => item.status === 'up').length;
    const totalCount = uptimeData.length;
    const calculatedUptime = totalCount > 0 ? (upCount / totalCount) * 100 : 0;

    // Limit display to last 20 items for performance
    const limitedData = uptimeData.slice(0, 20);

    return {
      uptimePercentage: Math.round(calculatedUptime * 100) / 100,
      displayData: limitedData
    };
  }, [uptimeData, uptime]);

  // Memoize the status items to prevent unnecessary re-renders
  const statusItems = useMemo(() => 
    displayData.map((item, index) => (
      <UptimeStatusItem key={`${item.id}-${index}`} item={item} index={index} />
    )),
    [displayData]
  );

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-3">
        <div className="flex space-x-0.5 min-w-0">
          {statusItems.length > 0 ? statusItems : (
            // Fallback display when no data
            <div className="h-5 w-1.5 rounded-sm bg-gray-400" />
          )}
        </div>
        <span className="text-sm font-medium whitespace-nowrap">
          {uptimePercentage.toFixed(1)}%
        </span>
      </div>
      
      <span className="text-xs text-muted-foreground">
            {t('last20Checks')}
      </span>    
    </TooltipProvider>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const UptimeBar = memo(UptimeBarComponent);