
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DockerStatsCards } from "@/components/docker/DockerStatsCards";
import { DockerContainersTable } from "@/components/docker/DockerContainersTable";
import { dockerService } from "@/services/dockerService";
import { DockerContainer, DockerStats } from "@/types/docker.types";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ContainerMonitoring = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const [stats, setStats] = useState<DockerStats>({
    total: 0,
    running: 0,
    stopped: 0,
    warning: 0
  });
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

 // console.log('ContainerMonitoring component loaded with serverId:', serverId);

  const {
    data: containers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['docker-containers', serverId],
    queryFn: () => {
   //   console.log('Query function called with serverId:', serverId);
      return serverId ? dockerService.getContainersByServerId(serverId) : dockerService.getContainers();
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

 // console.log('Query state:', { containers, isLoading, error });

  useEffect(() => {
  //  console.log('Containers changed:', containers);
    if (containers.length > 0) {
      dockerService.getContainerStats(containers).then(newStats => {
      //  console.log('Stats calculated:', newStats);
        setStats(newStats);
      });
    }
  }, [containers]);

  const handleRefresh = () => {
  //  console.log('Manual refresh triggered');
    refetch();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleBackToServers = () => {
    navigate('/instance-monitoring');
  };

  if (error) {
  //  console.error('Container monitoring error:', error);
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex flex-col flex-1">
          <Header 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            sidebarCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="text-center max-w-md w-full">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{t('errorLoadingContainers')}</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {t('unableToFetchContainerData')}
              </p>
              <div className="text-xs text-muted-foreground mb-4 font-mono">
                {t('errorUnknown')}: {error?.message || t('errorUnknown')}
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRefresh} className="text-sm sm:text-base">
                  {t('retry')}
                </Button>
                <Button onClick={handleBackToServers} variant="outline" className="text-sm sm:text-base">
                  {t('backToServers')}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <main className="flex-1 overflow-auto">
          <div className="mx-[20px] my-[20px]">
            {/* Header Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      onClick={handleBackToServers}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('backToServers')}
                    </Button>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {t('containerMonitoring')}
                  </h1>
                  <p className={`text-muted-foreground mt-1 sm:mt-2 transition-all duration-300 ${sidebarCollapsed ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                    {t('monitorAndManageContainers')}
                    {serverId && (
                      <span className="block text-xs text-muted-foreground/70 mt-1">
                        {t('serverIdLabel')}: {serverId}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards Section */}
            <div className="mb-6 lg:mb-8">
              <DockerStatsCards stats={stats} />
            </div>
            
            {/* Containers Table Section */}
            <div className="min-w-0">
              <DockerContainersTable 
                containers={containers} 
                isLoading={isLoading} 
                onRefresh={handleRefresh} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContainerMonitoring;