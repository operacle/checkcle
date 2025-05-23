
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CalendarClock, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScheduledMaintenanceTab } from "./ScheduledMaintenanceTab";
import { IncidentManagementTab } from "./IncidentManagementTab";
import { CreateMaintenanceDialog } from './maintenance/CreateMaintenanceDialog';
import { CreateIncidentDialog } from './incident/CreateIncidentDialog';
import { useToast } from '@/hooks/use-toast';
import { initMaintenanceNotifications, stopMaintenanceNotifications } from '@/services/maintenance/maintenanceNotificationService';

export const ScheduleIncidentContent = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("maintenance");
  const [createMaintenanceDialogOpen, setCreateMaintenanceDialogOpen] = useState(false);
  const [createIncidentDialogOpen, setCreateIncidentDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [incidentRefreshTrigger, setIncidentRefreshTrigger] = useState(0);

  // Initialize maintenance notifications when the component mounts
  useEffect(() => {
    console.log("Initializing maintenance notifications");
    initMaintenanceNotifications();
    
    // Clean up when the component unmounts
    return () => {
      console.log("Cleaning up maintenance notifications");
      stopMaintenanceNotifications();
    };
  }, []);

  const handleCreateButtonClick = () => {
    if (activeTab === "maintenance") {
      setCreateMaintenanceDialogOpen(true);
    } else {
      setCreateIncidentDialogOpen(true);
    }
  };

  const handleMaintenanceCreated = () => {
    // Refresh data by incrementing the refresh trigger
    const newTriggerValue = refreshTrigger + 1;
    console.log("Maintenance created, refreshing data with new trigger value:", newTriggerValue);
    setRefreshTrigger(newTriggerValue);
    
    // Show success toast
    toast({
      title: t('success'),
      description: t('maintenanceCreatedSuccess'),
    });
  };

  const handleIncidentCreated = () => {
    // Refresh data by incrementing the refresh trigger
    const newTriggerValue = incidentRefreshTrigger + 1;
    console.log("Incident created, refreshing data with new trigger value:", newTriggerValue);
    setIncidentRefreshTrigger(newTriggerValue);
    
    // Show success toast
    toast({
      title: t('success'),
      description: t('incidentCreatedSuccess'),
    });
  };

  return (
    <main className="flex-1 flex flex-col overflow-auto bg-background p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">
            {t('scheduleIncidentManagement')}
          </h2>
          <Button 
            className="text-primary-foreground"
            onClick={handleCreateButtonClick}
          >
            <Plus className="w-4 h-4 mr-2" /> 
            {activeTab === "maintenance" ? t('createMaintenanceWindow') : t('createIncident')}
          </Button>
        </div>
        
        <Tabs 
          defaultValue="maintenance" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="maintenance">
              <CalendarClock className="w-4 h-4 mr-2" />
              {t('scheduledMaintenance')}
            </TabsTrigger>
            <TabsTrigger value="incidents">
              <AlertCircle className="w-4 h-4 mr-2" />
              {t('incidentManagement')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="maintenance" className="space-y-4">
            <ScheduledMaintenanceTab refreshTrigger={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="incidents" className="space-y-4">
            <IncidentManagementTab refreshTrigger={incidentRefreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Maintenance creation dialog */}
      <CreateMaintenanceDialog 
        open={createMaintenanceDialogOpen}
        onOpenChange={setCreateMaintenanceDialogOpen}
        onMaintenanceCreated={handleMaintenanceCreated}
      />

      {/* Incident creation dialog */}
      <CreateIncidentDialog 
        open={createIncidentDialogOpen}
        onOpenChange={setCreateIncidentDialogOpen}
        onIncidentCreated={handleIncidentCreated}
      />
    </main>
  );
};
