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
import { useSidebar } from "@/contexts/SidebarContext";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const InstanceMonitoring = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const [stats, setStats] = useState<ServerStats>({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0,
  });

  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const {
    data: servers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["servers"],
    queryFn: serverService.getServers,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (servers.length > 0) {
      serverService.getServerStats(servers).then(setStats);
    }
  }, [servers]);

  const handleRefresh = () => {
    refetch();
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleAgentAdded = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex flex-col flex-1 min-w-0">
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 ">
            <div className="text-center max-w-md w-full">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                Error loading servers
              </h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Unable to fetch server data. Please check your connection and
                try again.
              </p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground ">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 ">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-auto  dark:bg-black p-2  shadow">
          <div className="p-4 sm:p-2 lg:p-2 space-y-6 h-full bg-white dark:bg-black p-4 rounded-xl">
            {/* Header Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 ">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl lg:text-2xl font-bold text-foreground">
                    Instance Monitoring
                  </h1>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                    Monitor and manage your server instances in real-time
                  </p>
                </div>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="flex-shrink-0"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Server Agent
                </Button>
              </div>
            </div>

            {/* Stats Cards Section */}
            <div className="p-2 ">
              <ServerStatsCards stats={stats} />
            </div>

            {/* Server Table Section */}
            <div className="p-3">
              <ServerTable
                servers={servers}
                isLoading={isLoading}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </main>
      </div>

      <AddServerAgentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAgentAdded={handleAgentAdded}
      />
    </div>
  );
};

export default InstanceMonitoring;
