import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ServerStatsCards } from "@/components/servers/ServerStatsCards";
import { ServerTable } from "@/components/servers/ServerTable";
import { AddServerAgentDialog } from "@/components/servers/AddServerAgentDialog";
import { serverService } from "@/services/serverService";
import { Server, ServerStats } from "@/types/server.types";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const InstanceMonitoring = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ServerStats>({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0
  });
  
  const [currentUser] = useState(authService.getCurrentUser());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const { data: servers = [], isLoading, error, refetch } = useQuery<Server[]>({
    queryKey: ['servers'],
    queryFn: serverService.getServers,
    refetchInterval: 30000
  });
  
  useEffect(() => {
    if (servers.length > 0) {
      serverService.getServerStats(servers).then(setStats);
    }
  }, [servers]);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {t('instanceMonitoring')}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t('describeMonitorInstance')}
                </p>
              </div>
              <Button onClick={() => setAddDialogOpen(true)} className="flex-shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                {t('addServerAgent')}
              </Button>
            </div>

            <ServerStatsCards stats={stats} />
            <ServerTable servers={servers} isLoading={isLoading} onRefresh={refetch} />
          </div>
        </main>
      </div>

      <AddServerAgentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAgentAdded={refetch}
      />
    </div>
  );
};

export default InstanceMonitoring;