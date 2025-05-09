
import React, { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { authService } from "@/services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import GeneralSettingsPanel from "@/components/settings/GeneralSettings";
import UserManagement from "@/components/settings/user-management";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AlertsTemplates } from "@/components/settings/alerts-templates";
import { AboutSystem } from "@/components/settings/about-system";

const Settings = () => {
  // State for sidebar collapse functionality
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  // Get current user
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the panel from URL query params
  const queryParams = new URLSearchParams(location.search);
  const panelParam = queryParams.get('panel');
  
  // State for active settings panel
  const [activePanel, setActivePanel] = useState<string>(panelParam || "general");
  
  // Update active panel when URL changes
  useEffect(() => {
    const panel = queryParams.get('panel');
    if (panel) {
      setActivePanel(panel);
    } else {
      setActivePanel("general");
    }
  }, [location.search]);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {activePanel === "general" && <GeneralSettingsPanel />}
          {activePanel === "users" && <UserManagement />}
          {activePanel === "notifications" && <NotificationSettings />}
          {activePanel === "templates" && <AlertsTemplates />}
          {activePanel === "about" && <AboutSystem />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
