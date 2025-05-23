
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MaintenanceTable, MaintenanceStatusChecker } from './maintenance';
import { EmptyMaintenanceState } from './maintenance/EmptyMaintenanceState';
import { OverviewCard } from './common/OverviewCard';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useMaintenanceData } from './hooks/useMaintenanceData';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/services/LoadingState';

interface ScheduledMaintenanceTabProps {
  refreshTrigger?: number;
}

export const ScheduledMaintenanceTab = ({ refreshTrigger = 0 }: ScheduledMaintenanceTabProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [manualRefresh, setManualRefresh] = React.useState(0);
  
  // Combine the external refresh trigger with our internal one
  const combinedRefreshTrigger = refreshTrigger + manualRefresh;
  
  const { 
    loading, 
    filter, 
    setFilter, 
    maintenanceData, 
    overviewStats, 
    fetchMaintenanceData,
    isEmpty,
    error,
    initialized
  } = useMaintenanceData({ refreshTrigger: combinedRefreshTrigger });

  // Display toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: t('error'),
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast, t]);

  // Force fetch data on initial load
  useEffect(() => {
    console.log("ScheduledMaintenanceTab is mounted, fetching data");
    fetchMaintenanceData(true);
  }, [fetchMaintenanceData]);

  // Handle maintenance updates
  const handleMaintenanceUpdated = () => {
    console.log("Maintenance updated, refreshing data");
    setManualRefresh(prev => prev + 1);
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setFilter(value);
  };

  // Show full-page loading state during initial load
  if (loading && !initialized) {
    return <LoadingState />;
  }

  return (
    <>
      {/* Status checker for automatic updates */}
      <MaintenanceStatusChecker 
        maintenanceData={maintenanceData}
        onStatusUpdated={handleMaintenanceUpdated}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <OverviewCard
          title={t('upcomingMaintenance')}
          value={loading ? '...' : overviewStats.upcoming}
          icon={<Calendar className="h-5 w-5 text-white" />}
          isLoading={loading}
          color="blue"
        />
        <OverviewCard
          title={t('ongoingMaintenance')}
          value={loading ? '...' : overviewStats.ongoing}
          icon={<Clock className="h-5 w-5 text-white" />}
          isLoading={loading}
          color="amber"
        />
        <OverviewCard
          title={t('completedMaintenance')}
          value={loading ? '...' : overviewStats.completed}
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          isLoading={loading}
          color="green"
        />
        <OverviewCard
          title={t('totalScheduledHours')}
          value={loading ? '...' : `${overviewStats.totalDuration}h`}
          icon={<Clock className="h-5 w-5 text-white" />}
          isLoading={loading}
          color="purple"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('scheduledMaintenance')}</CardTitle>
          <CardDescription>
            {t('scheduledMaintenanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="upcoming" 
            value={filter} 
            className="w-full" 
            onValueChange={handleTabChange}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">{t('upcomingMaintenance')}</TabsTrigger>
              <TabsTrigger value="ongoing">{t('ongoingMaintenance')}</TabsTrigger>
              <TabsTrigger value="completed">{t('completedMaintenance')}</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <MaintenanceTable 
                data={maintenanceData}
                isLoading={loading && initialized}
                onMaintenanceUpdated={handleMaintenanceUpdated}
              />
            </TabsContent>
            
            <TabsContent value="ongoing" className="space-y-4">
              <MaintenanceTable 
                data={maintenanceData}
                isLoading={loading && initialized}
                onMaintenanceUpdated={handleMaintenanceUpdated}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <MaintenanceTable 
                data={maintenanceData}
                isLoading={loading && initialized}
                onMaintenanceUpdated={handleMaintenanceUpdated}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};
