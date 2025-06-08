
import React, { useEffect } from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScheduleIncidentContent } from "@/components/schedule-incident/ScheduleIncidentContent";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { initMaintenanceNotifications, stopMaintenanceNotifications } from "@/services/maintenance/maintenanceNotificationService";
import { useSidebar } from "@/contexts/SidebarContext";

const ScheduleIncident = () => {
  // Use shared sidebar state
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  
  // Get current theme and language
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  
  // Initialize maintenance notifications
  useEffect(() => {
    initMaintenanceNotifications();
    
    // Clean up on unmount
    return () => {
      stopMaintenanceNotifications();
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

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
        <ScheduleIncidentContent />
      </div>
    </div>
  );
};

export default ScheduleIncident;