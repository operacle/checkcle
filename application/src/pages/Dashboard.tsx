
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { serviceService } from "@/services/serviceService";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/services/LoadingState";
import { useSidebar } from "@/contexts/SidebarContext";

const Dashboard = () => {
  // Use shared sidebar state
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  // Get current user
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  
  // For debugging user data
  useEffect(() => {
    console.log("Current user data:", currentUser);
  }, [currentUser]);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Fetch all services
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
    refetchInterval: 10000, // Refresh data every 10 seconds
  });

  // Start monitoring all active services when the dashboard loads
  useEffect(() => {
    const startActiveServices = async () => {
      await serviceService.startAllActiveServices();
      console.log("Active services monitoring started");
    };

    startActiveServices();
  }, []);

  // Show the loading state while fetching data
  if (isLoading) {
    return <LoadingState />;
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
        <DashboardContent 
          services={services}
          isLoading={isLoading}
          error={error as Error}
        />
      </div>
    </div>
  );
};

export default Dashboard;