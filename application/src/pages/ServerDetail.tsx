import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { serverService } from "@/services/serverService";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Server } from "lucide-react";
import { ServerMetricsOverview } from "@/components/servers/ServerMetricsOverview";
import { ServerHistoryCharts } from "@/components/servers/ServerHistoryCharts";
import { ServerSystemInfoCard } from "@/components/servers/ServerSystemInfoCard";

const ServerDetail = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  //console.log('ServerDetail component loaded with serverId:', serverId);

  const {
    data: server,
    isLoading: serverLoading,
    error: serverError
  } = useQuery({
    queryKey: ['server', serverId],
    queryFn: () => serverService.getServer(serverId!),
    enabled: !!serverId
  });

  const getOSLogo = (server: any) => {
    if (!server) return null;
    
    // Parse system_info if it's a string, but handle both JSON and plain text
    let systemInfo: any = {};
    let systemInfoText = '';
    
    if (server.system_info) {
      if (typeof server.system_info === 'string') {
        // Try to parse as JSON first
        try {
          systemInfo = JSON.parse(server.system_info);
        } catch (error) {
          // If JSON parsing fails, treat it as plain text
       //   console.log('system_info is plain text:', server.system_info);
          systemInfoText = server.system_info.toLowerCase();
        }
      } else {
        systemInfo = server.system_info;
      }
    }
    
    // Check system_info (both JSON and plain text), then fallback to os_type
    const osFromJson = systemInfo.OSName || '';
    const osFromText = systemInfoText;
    const osFromType = server.os_type || '';
    
    // Combine all OS information for detection
    const combinedOSInfo = `${osFromJson} ${osFromText} ${osFromType}`.toLowerCase();
    
   // console.log('OS detection info:', { osFromJson, osFromText, osFromType, combinedOSInfo });
    
    // Check for specific OS distributions first (most specific to least specific)
    if (combinedOSInfo.includes('ubuntu')) {
      return '/upload/os/ubuntu.png';
    } else if (combinedOSInfo.includes('debian')) {
      return '/upload/os/debian.png';
    } else if (combinedOSInfo.includes('centos')) {
      return '/upload/os/centos.png';
    } else if (combinedOSInfo.includes('rhel') || combinedOSInfo.includes('red hat')) {
      return '/upload/os/rhel.png';
    } else if (combinedOSInfo.includes('fedora')) {
      return '/upload/os/fedora.png';
    } else if (combinedOSInfo.includes('suse') || combinedOSInfo.includes('opensuse')) {
      return '/upload/os/suse.png';
    } else if (combinedOSInfo.includes('arch')) {
      return '/upload/os/arch.png';
    } else if (combinedOSInfo.includes('alpine')) {
      return '/upload/os/alpine.png';
    } else if (combinedOSInfo.includes('windows')) {
      return '/upload/os/windows.png';
    } else if (combinedOSInfo.includes('macos') || combinedOSInfo.includes('darwin') || combinedOSInfo.includes('mac os')) {
      return '/upload/os/macos.png';
    } else if (combinedOSInfo.includes('freebsd')) {
      return '/upload/os/freebsd.png';
    } else if (combinedOSInfo.includes('linux') || combinedOSInfo.includes('gnu')) {
      // Default to linux.png for any Linux-based system that doesn't match specific distributions
      return '/upload/os/linux.png';
    }
    
    // Final fallback - if we can't determine the OS, default to linux.png
    return '/upload/os/linux.png';
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleBackToServers = () => {
    navigate('/instance-monitoring');
  };

  if (serverError) {
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
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{t('errorLoadingServer')}</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {t('unableToFetchServerData')}
              </p>
              <div className="text-xs text-muted-foreground mb-4 font-mono">
                Error: {serverError?.message || 'Unknown error'}
              </div>
              <Button onClick={handleBackToServers} variant="outline" className="text-sm sm:text-base">
                {t('backToServers')}
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (serverLoading) {
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('loadingServerDetails')}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center p-2">
                      {server && getOSLogo(server) ? (
                        <img
                          src={getOSLogo(server)}
                          alt="OS Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Server className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {server?.name || t('serverDetail')}
                    </h1>
                  </div>
                  <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                    {t('monitorServerMetrics')}
                    {server && (
                      <span className="block text-xs text-muted-foreground/70 mt-1">
                        {t('serverHostnameIpOs')
                          .replace('{hostname}', server.hostname)
                          .replace('{ip_address}', server.ip_address)
                          .replace('{os_type}', server.os_type)}
                      </span>
                    )}
                  </p>
                </div>
                
                {/* System Info Card */}
                {server && (
                  <div className="flex-shrink-0">
                    <ServerSystemInfoCard server={server} />
                  </div>
                )}
              </div>
            </div>

            {/* Server Overview Cards */}
            {server && (
              <div className="mb-6 lg:mb-8">
                <ServerMetricsOverview server={server} />
              </div>
            )}

            {/* Historical Charts Section - Single comprehensive section */}
            {server && (
              <div className="min-w-0">
                <ServerHistoryCharts serverId={server.id} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServerDetail;