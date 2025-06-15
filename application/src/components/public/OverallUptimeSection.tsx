
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { UptimeData } from '@/types/service.types';
import { UptimeHistoryRenderer } from './UptimeHistoryRenderer';

interface OverallUptimeSectionProps {
  uptimeData: Record<string, UptimeData[]>;
}

export const OverallUptimeSection = ({ uptimeData }: OverallUptimeSectionProps) => {
  const getOverallUptime = () => {
    const allHistories = Object.values(uptimeData);
    if (allHistories.length === 0) return 99.9;
    
    let totalRecords = 0;
    let upRecords = 0;
    
    allHistories.forEach(history => {
      totalRecords += history.length;
      upRecords += history.filter(record => record.status === 'up').length;
    });
    
    if (totalRecords === 0) return 99.9;
    return Math.round((upRecords / totalRecords) * 100 * 100) / 100;
  };

  const getUptimeTrend = () => {
    const uptime = getOverallUptime();
    if (uptime >= 99.9) return 'excellent';
    if (uptime >= 99.5) return 'good';
    if (uptime >= 95) return 'fair';
    return 'poor';
  };

  const getIncidentCount = () => {
    const allHistories = Object.values(uptimeData);
    let incidents = 0;
    
    allHistories.forEach(history => {
      let wasDown = false;
      history.forEach(record => {
        if (record.status === 'down' && !wasDown) {
          incidents++;
          wasDown = true;
        } else if (record.status === 'up') {
          wasDown = false;
        }
      });
    });
    
    return incidents;
  };

  const getBadgeClassName = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return 'Needs Improvement';
    }
  };

  const getStatusMessage = (uptime: number) => {
    if (uptime >= 99.9) {
      return "All systems are performing excellently with minimal downtime.";
    } else if (uptime >= 99.5) {
      return "Systems are performing well with occasional minor issues.";
    } else if (uptime >= 95) {
      return "We're working to improve system reliability and reduce incidents.";
    } else {
      return "We apologize for recent service disruptions and are actively working on improvements.";
    }
  };

  const overallUptime = getOverallUptime();
  const trend = getUptimeTrend();
  const incidentCount = getIncidentCount();

  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics (Last 90 Days)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Historical performance and reliability statistics
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Overall Uptime</span>
              </div>
              <Badge className={getBadgeClassName(trend)}>
                {getTrendText(trend)}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{overallUptime}%</div>
            <div className="text-xs text-green-700 dark:text-green-300 mt-1">
              Target: 99.9%
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Incidents</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{incidentCount}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Last 90 days
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Response</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100ms</div>
            <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Response time
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Uptime History</h4>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-yellow-500 rounded"></div>
                <span>Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded"></div>
                <span>Down</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-background/50 rounded-lg border">
            {Object.keys(uptimeData).length > 0 ? (
              <UptimeHistoryRenderer serviceId={Object.keys(uptimeData)[0]} uptimeData={uptimeData} />
            ) : (
              <div className="flex justify-center items-center h-12 text-muted-foreground">
                <div className="flex gap-1">
                  {Array.from({ length: 90 }, (_, i) => (
                    <div key={i} className="h-8 w-1 bg-green-500 rounded-sm"></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="text-sm text-muted-foreground text-center">
            {getStatusMessage(overallUptime)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};