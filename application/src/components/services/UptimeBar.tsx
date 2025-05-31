import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X, AlertTriangle, Pause, Clock, Info, RefreshCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { uptimeService } from "@/services/uptimeService";
import { UptimeData } from "@/types/service.types";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface UptimeBarProps {
  uptime: number;
  status: string;
  serviceId?: string;
  interval?: number; // Service monitoring interval in seconds
}

export const UptimeBar = ({ uptime, status, serviceId, interval = 60 }: UptimeBarProps) => {
  const { theme } = useTheme();
  const [historyItems, setHistoryItems] = useState<UptimeData[]>([]);
  
  // Fetch real uptime history data if serviceId is provided with improved caching and error handling
  const { data: uptimeData, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['uptimeHistory', serviceId],
    queryFn: () => serviceId ? uptimeService.getUptimeHistory(serviceId, 50) : Promise.resolve([]),
    enabled: !!serviceId,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data fresh for 15 seconds
    placeholderData: (previousData) => previousData, // Show previous data while refetching
    retry: 3, // Retry failed requests three times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff with max 10s
  });
  
  // Filter uptime data to respect the service interval
  const filterUptimeDataByInterval = (data: UptimeData[], intervalSeconds: number): UptimeData[] => {
    if (!data || data.length === 0) return [];
    
    // Sort data by timestamp (newest first)
    const sortedData = [...data].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const filtered: UptimeData[] = [];
    let lastIncludedTime: number | null = null;
    const intervalMs = intervalSeconds * 1000; // Convert to milliseconds
    
    // Include the most recent record first
    if (sortedData.length > 0) {
      filtered.push(sortedData[0]);
      lastIncludedTime = new Date(sortedData[0].timestamp).getTime();
    }
    
    // Filter subsequent records to maintain proper interval spacing
    for (let i = 1; i < sortedData.length && filtered.length < 20; i++) {
      const currentTime = new Date(sortedData[i].timestamp).getTime();
      
      // Only include if enough time has passed since the last included record
      if (lastIncludedTime && (lastIncludedTime - currentTime) >= intervalMs) {
        filtered.push(sortedData[i]);
        lastIncludedTime = currentTime;
      }
    }
    
    return filtered;
  };
  
  // Update history items when data changes
  useEffect(() => {
    if (uptimeData && uptimeData.length > 0) {
      // Filter data based on the service interval
      const filteredData = filterUptimeDataByInterval(uptimeData, interval);
      setHistoryItems(filteredData);
    } else if (status === "paused" || (uptimeData && uptimeData.length === 0)) {
      // For paused services with no history, or empty history data, show all as paused
      const statusValue = (status === "up" || status === "down" || status === "warning" || status === "paused") 
        ? status 
        : "paused"; // Default to paused if not a valid status
        
      const placeholderHistory: UptimeData[] = Array(20).fill(null).map((_, index) => ({
        id: `placeholder-${index}`,
        serviceId: serviceId || "",
        timestamp: new Date(Date.now() - (index * interval * 1000)).toISOString(),
        status: statusValue as "up" | "down" | "warning" | "paused",
        responseTime: 0
      }));
      setHistoryItems(placeholderHistory);
    }
  }, [uptimeData, serviceId, status, interval]);

  // Get appropriate color classes for each status type
  const getStatusColor = (itemStatus: string) => {
    switch(itemStatus) {
      case "up":
        return theme === "dark" ? "bg-emerald-500" : "bg-emerald-500"; 
      case "down":
        return theme === "dark" ? "bg-red-500" : "bg-red-500";
      case "warning":
        return theme === "dark" ? "bg-yellow-500" : "bg-yellow-500";
      case "paused":
      default:
        return theme === "dark" ? "bg-gray-500" : "bg-gray-400";
    }
  };
  
  // Get status label
  const getStatusLabel = (itemStatus: string): string => {
    switch(itemStatus) {
      case "up": return "Online";
      case "down": return "Offline";
      case "warning": return "Degraded";
      case "paused": return "Paused";
      default: return "Unknown";
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString([], {
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return timestamp;
    }
  };

  // If still loading and no history, show improved loading state
  if ((isLoading || isFetching) && historyItems.length === 0) {
    // Show skeleton loading UI instead of text
    return (
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center space-x-0.5 w-full h-6">
          {Array(20).fill(0).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className={`h-5 w-1.5 rounded-sm bg-muted animate-pulse`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground w-16 h-4 bg-muted animate-pulse rounded"></span>
          <span className="text-muted-foreground w-24 h-4 bg-muted animate-pulse rounded"></span>
        </div>
      </div>
    );
  }
  
  // If there's an error and no history, show improved error state with retry button
  if (error && historyItems.length === 0) {
    // Provide visual error state that matches the design system
    return (
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center space-x-0.5 w-full h-6">
          {Array(20).fill(0).map((_, index) => (
            <div 
              key={`error-${index}`}
              className={`h-5 w-1.5 rounded-sm bg-gray-700 opacity-40`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{Math.round(uptime)}% uptime</span>
          <button 
            onClick={() => refetch()} 
            className="text-xs text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors"
          >
            <X className="h-3 w-3" /> Connection error 
            <RefreshCcw className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // Ensure we always have 20 items by padding with the last known status
  const displayItems = [...historyItems];
  if (displayItems.length < 20) {
    const lastItem = displayItems.length > 0 ? displayItems[displayItems.length - 1] : null;
    const lastStatus = lastItem ? lastItem.status : 
                      (status === "up" || status === "down" || status === "warning" || status === "paused") ? 
                      status as "up" | "down" | "warning" | "paused" : "paused";
    
    // Generate padding items with proper time spacing
    const paddingItems: UptimeData[] = Array(20 - displayItems.length).fill(null).map((_, index) => {
      const baseTime = lastItem ? new Date(lastItem.timestamp).getTime() : Date.now();
      const timeOffset = (index + 1) * interval * 1000; // Respect the interval
      
      return {
        id: `padding-${index}`,
        serviceId: serviceId || "",
        timestamp: new Date(baseTime - timeOffset).toISOString(),
        status: lastStatus,
        responseTime: 0
      };
    });
    displayItems.push(...paddingItems);
  }

  // Limit to 20 items for display
  const limitedItems = displayItems.slice(0, 20);
  
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center space-x-0.5 w-full h-6">
          {limitedItems.map((item, index) => (
            <Tooltip key={item.id || `status-${index}`}>
              <TooltipTrigger asChild>
                <div 
                  className={`h-5 w-1.5 rounded-sm ${getStatusColor(item.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                />
              </TooltipTrigger>
              <TooltipContent 
                side="top"
                className="bg-gray-900 text-white border-gray-800 px-3 py-2"
              >
                <div className="flex flex-col gap-1 text-xs">
                  <div className="font-medium">{getStatusLabel(item.status)}</div>
                  <div>
                    {item.status !== "paused" && item.status !== "down" ? 
                      `${item.responseTime}ms` : 
                      "No response"}
                  </div>
                  <div className="text-gray-400">
                    {formatTimestamp(item.timestamp)}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {Math.round(uptime)}% uptime
          </span>
          <span className="text-xs text-muted-foreground">
            Last 20 checks 
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}