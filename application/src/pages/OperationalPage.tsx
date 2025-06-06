
import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OperationalPageContent } from '@/components/operational-page/OperationalPageContent';
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const OperationalPage = () => {
  // State for sidebar collapse functionality
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  // Get current user
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  
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
        <div className="flex-1 overflow-auto">
          <OperationalPageContent />
        </div>
      </div>
    </div>
  );
};

export default OperationalPage;