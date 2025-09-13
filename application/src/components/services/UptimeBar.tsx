
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

  // Fetch uptime data with very aggressive caching to reduce API calls
  const { data: uptimeData = [] } = useQuery({
    queryKey: ['uptime-bar', serviceId, serviceType],
    queryFn: () => uptimeService.getUptimeHistory(serviceId, 20, startDate, endDate, serviceType),
    enabled: !!serviceId,
    staleTime: 30000, // Data is fresh for 30 seconds
    gcTime: 600000, // Keep in cache for 10 minutes
    refetchInterval: 60000, // 1 minute polling
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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