
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { TimeRangeSelector } from "./charts/TimeRangeSelector";
import { useServerHistoryData } from "./charts/hooks/useServerHistoryData";
import { CPUChart } from "./charts/CPUChart";
import { MemoryChart } from "./charts/MemoryChart";
import { DiskChart } from "./charts/DiskChart";
import { NetworkChart } from "./charts/NetworkChart";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServerHistoryChartsProps {
  serverId: string;
}

export const ServerHistoryCharts = ({ serverId }: ServerHistoryChartsProps) => {
  const { t } = useLanguage();
  const {
    timeRange,
    setTimeRange,
    metrics,
    chartData,
    isLoading,
    error,
    isFetching
  } = useServerHistoryData(serverId);

 // console.log('ServerHistoryCharts: Rendering with serverId:', serverId, 'timeRange:', timeRange);

  // Memoize latest data calculation to prevent unnecessary recalculations
  const latestData = useMemo(() => {
    return chartData.length > 0 ? chartData[chartData.length - 1] : null;
  }, [chartData]);

  // Show skeleton loading state for better UX
  if (isLoading) {
   return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-lg font-medium">{t("historicalPerformance")}</h2>
            <div className="flex items-center gap-2 ml-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs text-muted-foreground">{t("loading")}</span>
            </div>
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        
        {/* Skeleton loading cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-4 lg:p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg"></div>
                      <div className="w-24 h-5 bg-muted rounded"></div>
                    </div>
                    <div className="w-16 h-4 bg-muted rounded"></div>
                  </div>
                  <div className="w-full h-64 lg:h-80 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
  //  console.error('ServerHistoryCharts: Error loading data:', error);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-lg font-medium">{t("historicalPerformance")}</h2>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">{t("errorLoadingChartData")}</p>
              <p className="text-xs mt-2 font-mono text-red-500">{error?.message}</p>
              <p className="text-xs mt-1 text-muted-foreground">{t("serverIdTimeRange", { serverId, timeRange })}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-lg font-medium">{t("historicalPerformance")}</h2>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">{t("noHistoricalData", { timeRange })}</p>
              <p className="text-xs mt-2">{t("rawMetricsCount", { count: metrics.length })}</p>
              <p className="text-xs mt-1">{t("serverIdTimeRange", { serverId, timeRange })}</p>
              <p className="text-xs mt-1 text-muted-foreground">
                {metrics.length > 0
                  ? t("dataExistsOutsideRange")
                  : t("noMetricsDataFound")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

//  console.log('ServerHistoryCharts: Rendering charts with', chartData.length, 'data points for time range:', timeRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-lg font-medium">{t("historicalPerformance")}</h2>
          <span className="text-xs text-muted-foreground">
            ({chartData.length} data points • {timeRange})
            {isFetching && (
              <span className="inline-flex items-center gap-1 ml-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-blue-500">{t("updating")}</span>
              </span>
            )}
          </span>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Improved responsive grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 auto-rows-fr">
        <div className="w-full min-w-0">
          <CPUChart data={chartData} latestData={latestData} />
        </div>
        <div className="w-full min-w-0">
          <MemoryChart data={chartData} latestData={latestData} />
        </div>
        <div className="w-full min-w-0">
          <DiskChart data={chartData} latestData={latestData} />
        </div>
        <div className="w-full min-w-0">
          <NetworkChart data={chartData} latestData={latestData} />
        </div>
      </div>
    </div>
  );
};