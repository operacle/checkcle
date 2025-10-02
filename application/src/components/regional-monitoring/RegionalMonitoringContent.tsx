
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Activity, Wifi, WifiOff } from "lucide-react";
import { regionalService } from "@/services/regionalService";
import { RegionalService } from "@/types/regional.types";
import { AddRegionalAgentDialog } from "./AddRegionalAgentDialog";
import { RegionalAgentCard } from "./RegionalAgentCard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const RegionalMonitoringContent = () => {
  const { t } = useLanguage();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: regionalServices = [], isLoading, error } = useQuery({
    queryKey: ['regional-services'],
    queryFn: regionalService.getRegionalServices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleAgentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['regional-services'] });
    toast({
      title: t('regionalAgentAdded'),
      description: t('regionalAgentAddedDesc'),
    });
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      await regionalService.deleteRegionalService(id);
      queryClient.invalidateQueries({ queryKey: ['regional-services'] });
      toast({
        title: t('agentRemoved'),
        description: t('agentRemovedDesc'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRemoveAgent'),
        variant: "destructive",
      });
    }
  };

  const onlineAgents = regionalServices.filter(agent => agent.connection === 'online').length;
  const totalAgents = regionalServices.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('regionalmonitoring')}</h1>
          <p className="text-muted-foreground">
            {t('descriptRegionPage')}
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addRegionalAgent')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalAgents')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {t('regionalMonitoringAgents')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('onlineAgents')}</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineAgents}</div>
            <p className="text-xs text-muted-foreground">
              {t('currentlyConnected')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('offlineAgents')}</CardTitle>
            <WifiOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAgents - onlineAgents}</div>
            <p className="text-xs text-muted-foreground">
              {t('disconnectedAgents')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('regionalAgents')}</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : regionalServices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('noRegionalAgents')}</h3>
              <p className="text-muted-foreground text-center mb-4">
                {t('getStartedAddAgent')}
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addFirstAgent')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalServices.map((agent) => (
              <RegionalAgentCard 
                key={agent.id} 
                agent={agent} 
                onDelete={() => handleDeleteAgent(agent.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddRegionalAgentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAgentAdded={handleAgentAdded}
      />
    </div>
  );
};