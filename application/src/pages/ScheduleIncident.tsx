
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScheduleIncidentContent } from "@/components/schedule-incident/ScheduleIncidentContent";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { initMaintenanceNotifications, stopMaintenanceNotifications } from "@/services/maintenance/maintenanceNotificationService";

const ScheduleIncident = () => {
  // State for sidebar collapse functionality
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  
  // Get current theme and language
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  
  // Initialize maintenance notifications
  useEffect(() => {
    console.log("Initializing maintenance notifications");
    initMaintenanceNotifications();
    
    // Clean up on unmount
    return () => {
      console.log("Stopping maintenance notifications");
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