
import { Clock, Server, ArrowUp, ArrowDown } from "lucide-react";
import { Service, UptimeData } from "@/types/service.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { formatDistanceStrict } from "date-fns";

interface ServiceStatsCardsProps {
  service: Service;
  uptimeData: UptimeData[];
}

export function ServiceStatsCards({ service, uptimeData }: ServiceStatsCardsProps) {
  // Calculate uptime percentage
  const calculateUptimePercentage = () => {
    if (uptimeData.length === 0) return 100;
    
    const totalChecks = uptimeData.length;
    const upChecks = uptimeData.filter(data => data.status === "up").length;
    return Math.round((upChecks / totalChecks) * 100);
  };

  // Calculate total uptime/downtime
  const uptimeStats = useMemo(() => {
    if (uptimeData.length === 0) {
      return {
        totalUptimeFormatted: "N/A",
        totalDowntimeFormatted: "N/A",
        currentStatusDuration: "N/A"
      };
    }

    // Sort data by timestamp for chronological analysis
    const sortedData = [...uptimeData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get the status change events
    const statusChanges = sortedData.reduce((changes, check, index) => {
      if (index === 0 || (index > 0 && sortedData[index-1].status !== check.status)) {
        changes.push(check);
      }
      return changes;
    }, [] as UptimeData[]);

    let totalUptime = 0;
    let totalDowntime = 0;
    let currentStatus = service.status;
    let lastChangeTime = new Date();

    // Calculate durations between status changes
    for (let i = 0; i < statusChanges.length; i++) {
      const currentChange = statusChanges[i];
      const nextChange = statusChanges[i + 1];
      
      if (nextChange) {
        const duration = new Date(nextChange.timestamp).getTime() - new Date(currentChange.timestamp).getTime();
        
        if (currentChange.status === "up") {
          totalUptime += duration;
        } else {
          totalDowntime += duration;
        }
      } else {
        // For the last status, calculate time until now
        lastChangeTime = new Date(currentChange.timestamp);
        currentStatus = currentChange.status;
      }
    }
    
    // Add time from last change until now for current status
    const now = new Date();
    const sinceLastChange = now.getTime() - lastChangeTime.getTime();
    
    if (currentStatus === "up") {
      totalUptime += sinceLastChange;
    } else if (currentStatus === "down") {
      totalDowntime += sinceLastChange;
    }
    
    // Format durations
    const formatDuration = (ms: number): string => {
      if (ms < 1000) return "0s";
      return formatDistanceStrict(0, ms, { addSuffix: false });
    };

    return {
      totalUptimeFormatted: formatDuration(totalUptime),
      totalDowntimeFormatted: formatDuration(totalDowntime),
      currentStatusDuration: formatDuration(sinceLastChange)
    };
  }, [uptimeData, service.status]);

  // Calculate average response time from recent checks
  const calculateAverageResponseTime = () => {
    const upChecks = uptimeData.filter(data => data.status === "up" && data.responseTime > 0);
    if (upChecks.length === 0) return service.responseTime || 0;
    
    const sum = upChecks.reduce((total, check) => total + check.responseTime, 0);
    return Math.round((sum / upChecks.length) * 100) / 100; // Two decimal precision
  };

  const uptimePercentage = calculateUptimePercentage();
  const avgResponseTime = calculateAverageResponseTime();
  // Define upChecks here so we can use it in both the calculation and the JSX
  const upChecks = uptimeData.filter(data => data.status === "up" && data.responseTime > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="border-blue-400 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-100">Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-white">
            {service.responseTime}ms
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">Last checked at {service.lastChecked}</p>
          {avgResponseTime > 0 && avgResponseTime !== service.responseTime && (
            <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">Avg: {avgResponseTime}ms (last {upChecks.length} up checks)</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-900/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-100">Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-white">
            {uptimePercentage}%
          </div>
          <p className="text-xs text-green-600 dark:text-green-200 mt-1">Based on last {uptimeData.length} checks</p>
          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center text-xs text-green-600 dark:text-green-200">
              <ArrowUp className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
              <span>Total uptime: {uptimeStats.totalUptimeFormatted}</span>
            </div>
            <div className="flex items-center text-xs text-red-600 dark:text-red-200">
              <ArrowDown className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
              <span>Total downtime: {uptimeStats.totalDowntimeFormatted}</span>
            </div>
            {service.status !== "paused" && (
              <div className="flex items-center text-xs font-medium mt-1">
                <span className={service.status === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {service.status === "up" ? "Up" : "Down"} for {uptimeStats.currentStatusDuration}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-400 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-100">Monitoring Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-purple-700 dark:text-purple-200">
            <Clock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span>Checked every {service.interval} seconds</span>
          </div>
          <div className="flex items-center text-sm text-purple-700 dark:text-purple-200 mt-1">
            <Server className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span>{service.type} monitoring</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
