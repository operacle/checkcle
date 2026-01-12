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
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
    refetchInterval: 60000,
  });

  useEffect(() => {
    const startActiveServices = async () => {
      await serviceService.startAllActiveServices();
    };
    const timeoutId = setTimeout(startActiveServices, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
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