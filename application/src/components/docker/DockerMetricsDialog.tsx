import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { DockerContainer, DockerMetrics } from "@/types/docker.types";
import { dockerService } from "@/services/dockerService";
import { Loader2, Cpu, HardDrive, Network, MemoryStick } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockerMetricsDialogProps {
  container: DockerContainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TimeRange = '60m' | '1d' | '7d' | '1m' | '3m';

const timeRangeOptions = [
  { value: '60m' as TimeRange, label: 'minutes60', hours: 1 },
  { value: '1d' as TimeRange, label: 'day1', hours: 24 },
  { value: '7d' as TimeRange, label: 'days7', hours: 24 * 7 },
  { value: '1m' as TimeRange, label: 'month1', hours: 24 * 30 },
  { value: '3m' as TimeRange, label: 'months3', hours: 24 * 90 },
];

export const DockerMetricsDialog = ({ container, open, onOpenChange }: DockerMetricsDialogProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1d");
  const { theme } = useTheme();
  const { t } = useLanguage();

  const {
    data: metrics = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['docker-metrics', container?.docker_id, timeRange],
    queryFn: () => container ? dockerService.getContainerMetrics(container.docker_id) : Promise.resolve([]),
    enabled: !!container && open,
    refetchInterval: 30000
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const parseValueWithUnit = (value: string | number): { numeric: number; unit: string; original: string } => {
    if (typeof value === 'number') {
      return { numeric: value, unit: 'B', original: value.toString() };
    }
    
    const str = value.toString();
    const match = str.match(/^([\d.]+)\s*([A-Za-z%]*)/);
    if (match) {
      const numeric = parseFloat(match[1]);
      const unit = match[2] || '';
      return { numeric, unit, original: str };
    }
    return { numeric: 0, unit: '', original: str };
  };

  const convertToBytes = (value: string | number): number => {
    if (typeof value === 'number') return value;
    
    const parsed = parseValueWithUnit(value);
    const multipliers: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    };
    
    const multiplier = multipliers[parsed.unit.toUpperCase()] || 1;
    return parsed.numeric * multiplier;
  };

  const filterMetricsByTimeRange = (metrics: DockerMetrics[], timeRange: TimeRange): DockerMetrics[] => {
    const now = new Date();
    const selectedRange = timeRangeOptions.find(opt => opt.value === timeRange);
    if (!selectedRange) return metrics;

    const cutoffTime = new Date(now.getTime() - (selectedRange.hours * 60 * 60 * 1000));
    
    return metrics.filter(metric => {
      const metricTime = new Date(metric.timestamp);
      return metricTime >= cutoffTime;
    });
  };

  const formatChartData = (metrics: DockerMetrics[]) => {
    const filteredMetrics = filterMetricsByTimeRange(metrics, timeRange);
    
    return filteredMetrics.slice(0, 100).reverse().map((metric, index) => {
      // Parse CPU usage
      const cpuUsage = typeof metric.cpu_usage === 'string' ? 
        parseFloat(metric.cpu_usage.replace('%', '')) : 
        parseFloat(metric.cpu_usage) || 0;

      // Parse memory values
      const ramUsedBytes = convertToBytes(metric.ram_used);
      const ramTotalBytes = convertToBytes(metric.ram_total);
      const ramFreeBytes = convertToBytes(metric.ram_free);
      const ramUsagePercent = ramTotalBytes > 0 ? (ramUsedBytes / ramTotalBytes) * 100 : 0;

      // Parse disk values
      const diskUsedBytes = convertToBytes(metric.disk_used);
      const diskTotalBytes = convertToBytes(metric.disk_total);
      const diskFreeBytes = convertToBytes(metric.disk_free);
      const diskUsagePercent = diskTotalBytes > 0 ? (diskUsedBytes / diskTotalBytes) * 100 : 0;

      // Network values
      const networkRxBytes = metric.network_rx_bytes || 0;
      const networkTxBytes = metric.network_tx_bytes || 0;
      const networkRxSpeed = metric.network_rx_speed || 0;
      const networkTxSpeed = metric.network_tx_speed || 0;

      return {
        timestamp: new Date(metric.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        // CPU
        cpuUsage: Math.round(cpuUsage * 100) / 100,
        cpuCores: parseInt(metric.cpu_cores) || 0,
        cpuFree: 100 - cpuUsage,
        
        // Memory
        ramUsedBytes,
        ramTotalBytes,
        ramFreeBytes,
        ramUsed: formatBytes(ramUsedBytes),
        ramTotal: formatBytes(ramTotalBytes),
        ramFree: formatBytes(ramFreeBytes),
        ramUsagePercent: Math.round(ramUsagePercent * 100) / 100,
        
        // Disk
        diskUsedBytes,
        diskTotalBytes,
        diskFreeBytes,
        diskUsed: formatBytes(diskUsedBytes),
        diskTotal: formatBytes(diskTotalBytes),
        diskFree: formatBytes(diskFreeBytes),
        diskUsagePercent: Math.round(diskUsagePercent * 100) / 100,
        
        // Network
        networkRxBytes,
        networkTxBytes,
        networkRx: formatBytes(networkRxBytes),
        networkTx: formatBytes(networkTxBytes),
        networkRxSpeed: Math.round(networkRxSpeed * 100) / 100,
        networkTxSpeed: Math.round(networkTxSpeed * 100) / 100,
      };
    });
  };

  const chartData = formatChartData(metrics);
  const latestMetric = chartData[chartData.length - 1];

  const chartConfig = {
    cpuUsage: {
      label: "CPU Usage (%)",
      color: theme === 'dark' ? "#3b82f6" : "#2563eb",
    },
    ramUsagePercent: {
      label: "RAM Usage (%)",
      color: theme === 'dark' ? "#10b981" : "#059669",
    },
    diskUsagePercent: {
      label: "Disk Usage (%)",
      color: theme === 'dark' ? "#f59e0b" : "#d97706",
    },
    networkRx: {
      label: "Network RX",
      color: theme === 'dark' ? "#8b5cf6" : "#7c3aed",
    },
    networkTx: {
      label: "Network TX",
      color: theme === 'dark' ? "#ef4444" : "#dc2626",
    },
  };

  const getGridColor = () => theme === 'dark' ? '#374151' : '#e5e7eb';
  const getAxisColor = () => theme === 'dark' ? '#9ca3af' : '#6b7280';

  const MetricCard = ({ title, used, total, free, percentage, icon: Icon, color }: {
    title: string;
    used: string;
    total: string;
    free: string;
    percentage: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Used:</span>
          <span className="font-mono">{used}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Free:</span>
          <span className="font-mono">{free}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-mono">{total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Usage:</span>
          <span className="font-mono">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );

  if (!container) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-primary" />
              </div>
                {t('containerMetricsTitle', 'docker', { name: container.name })}
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label, 'docker')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t('dockerId', 'docker')}: {container.docker_id} • {container.hostname}
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{t('loadingMetrics', 'docker')}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <p>{t('errorLoadingMetrics', 'docker')}: {String((error as any)?.message ?? '')}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <p>{t('noMetricsAvailable', 'docker')}</p>
          </div>
        ) : (
          <>
            {/* Current Metrics Summary */}
            {latestMetric && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title={t('cpu', 'docker')}
                  used={`${latestMetric.cpuUsage}%`}
                  total={`${latestMetric.cpuCores} cores`}
                  free={`${(100 - latestMetric.cpuUsage).toFixed(1)}%`}
                  percentage={latestMetric.cpuUsage}
                  icon={Cpu}
                  color={chartConfig.cpuUsage.color}
                />
                <MetricCard
                  title={t('memoryTitle', 'docker')}
                  used={latestMetric.ramUsed}
                  total={latestMetric.ramTotal}
                  free={latestMetric.ramFree}
                  percentage={latestMetric.ramUsagePercent}
                  icon={MemoryStick}
                  color={chartConfig.ramUsagePercent.color}
                />
                <MetricCard
                  title={t('diskTitle', 'docker')}
                  used={latestMetric.diskUsed}
                  total={latestMetric.diskTotal}
                  free={latestMetric.diskFree}
                  percentage={latestMetric.diskUsagePercent}
                  icon={HardDrive}
                  color={chartConfig.diskUsagePercent.color}
                />
                <MetricCard
                  title={t('network', 'docker')}
                  used={`RX: ${latestMetric.networkRx}`}
                  total={`TX: ${latestMetric.networkTx}`}
                  free={`${t('networkSpeedKbs', 'docker').replace('(KB/s)', '')}: ${latestMetric.networkRxSpeed} KB/s`}
                  percentage={0}
                  icon={Network}
                  color={chartConfig.networkRx.color}
                />
              </div>
            )}

            <Tabs defaultValue="cpu" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger value="cpu" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Cpu className="h-4 w-4" />
                  {t('cpu', 'docker')}
                </TabsTrigger>
                <TabsTrigger value="memory" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <MemoryStick className="h-4 w-4" />
                  {t('memoryTitle', 'docker')}
                </TabsTrigger>
                <TabsTrigger value="disk" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <HardDrive className="h-4 w-4" />
                  {t('diskTitle', 'docker')}
                </TabsTrigger>
                <TabsTrigger value="network" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Network className="h-4 w-4" />
                  {t('network', 'docker')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cpu" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('cpuUsagePct', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cpuUsage" 
                            stroke={chartConfig.cpuUsage.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: chartConfig.cpuUsage.color }}
                            name={t('cpuUsagePct', 'docker')}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('cpuUsageVsAvailable', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpuFree" 
                            stackId="1"
                            stroke={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fill={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fillOpacity={0.3}
                            name={t('cpuAvailablePct', 'docker')}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpuUsage" 
                            stackId="1"
                            stroke={chartConfig.cpuUsage.color}
                            fill={chartConfig.cpuUsage.color}
                            fillOpacity={0.6}
                            name={t('cpuUsagePct', 'docker')}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="memory" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('ramUsagePct', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ramUsagePercent" 
                            stackId="1"
                            stroke={chartConfig.ramUsagePercent.color}
                            fill={chartConfig.ramUsagePercent.color}
                            fillOpacity={0.6}
                            name="RAM Usage (%)"
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('memoryUsageBytes', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                            tickFormatter={(value) => formatBytes(value)}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                            formatter={(value, name) => [
                              name === t('usedMemory', 'docker') ? formatBytes(Number(value)) : 
                              name === t('totalMemory', 'docker') ? formatBytes(Number(value)) : value,
                              name
                            ]}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ramTotalBytes" 
                            stackId="1"
                            stroke={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fill={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fillOpacity={0.3}
                            name={t('totalMemory', 'docker')}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ramUsedBytes" 
                            stackId="1"
                            stroke={chartConfig.ramUsagePercent.color}
                            fill={chartConfig.ramUsagePercent.color}
                            fillOpacity={0.6}
                            name={t('usedMemory', 'docker')}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="disk" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('diskUsagePct', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="diskUsagePercent" 
                            stackId="1"
                            stroke={chartConfig.diskUsagePercent.color}
                            fill={chartConfig.diskUsagePercent.color}
                            fillOpacity={0.6}
                            name={t('diskUsagePct', 'docker')}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('diskUsageBytes', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                            tickFormatter={(value) => formatBytes(value)}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                            formatter={(value, name) => [
                              name === t('usedDisk', 'docker') ? formatBytes(Number(value)) : 
                              name === t('totalDisk', 'docker') ? formatBytes(Number(value)) : value,
                              name
                            ]}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="diskTotalBytes" 
                            stackId="1"
                            stroke={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fill={theme === 'dark' ? "#6b7280" : "#9ca3af"}
                            fillOpacity={0.3}
                            name={t('totalDisk', 'docker')}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="diskUsedBytes" 
                            stackId="1"
                            stroke={chartConfig.diskUsagePercent.color}
                            fill={chartConfig.diskUsagePercent.color}
                            fillOpacity={0.6}
                            name={t('usedDisk', 'docker')}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('networkTraffic', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-64">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="networkRxBytes" 
                            stroke={chartConfig.networkRx.color}
                            strokeWidth={2}
                            name={t('rxBytes', 'docker')}
                            dot={{ r: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="networkTxBytes" 
                            stroke={chartConfig.networkTx.color}
                            strokeWidth={2}
                            name={t('txBytes', 'docker')}
                            dot={{ r: 2 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{t('networkSpeedKbs', 'docker')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-64">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: getAxisColor() }}
                            axisLine={{ stroke: getGridColor() }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-popover border-border" />}
                            cursor={{ stroke: getGridColor() }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="networkRxSpeed" 
                            stroke={chartConfig.networkRx.color}
                            strokeWidth={2}
                            name={t('rxSpeedKbs', 'docker')}
                            dot={{ r: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="networkTxSpeed" 
                            stroke={chartConfig.networkTx.color}
                            strokeWidth={2}
                            name={t('txSpeedKbs', 'docker')}
                            dot={{ r: 2 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};