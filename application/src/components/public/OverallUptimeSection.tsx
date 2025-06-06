
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Overall Uptime History (Last 90 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 mb-4">
          {Object.keys(uptimeData).length > 0 ? 
            <UptimeHistoryRenderer serviceId={Object.keys(uptimeData)[0]} uptimeData={uptimeData} /> : 
            <UptimeHistoryRenderer serviceId="overall" uptimeData={uptimeData} />}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getOverallUptime()}%</div>
          <div className="text-sm text-green-700 dark:text-green-300">Overall uptime</div>
        </div>
      </CardContent>
    </Card>
  );
};