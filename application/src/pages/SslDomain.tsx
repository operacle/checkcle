
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SSLDomainContent } from "@/components/ssl-domain/SSLDomainContent";
import { LoadingState } from "@/components/services/LoadingState";

const SslDomain = () => {
  // State for sidebar collapse functionality
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
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
        <SSLDomainContent />
      </div>
    </div>
  );
};

export default SslDomain;