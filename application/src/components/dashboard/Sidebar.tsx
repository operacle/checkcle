import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { MainNavigation } from "./sidebar/MainNavigation";
import { SettingsPanel } from "./sidebar/SettingsPanel";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const { theme } = useTheme();
  const { sidebarCollapsed, isMobileOpen, toggleMobileMenu } = useSidebar();
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:static lg:block transition-all duration-300 ease-in-out border-r flex flex-col h-full",
          theme === 'dark' ? 'bg-[#121212] border-[#1e1e1e]' : 'bg-sidebar border-sidebar-border',
          // Mobile state
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          // Desktop state (collapsed/expanded)
          !isMobileOpen && sidebarCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <SidebarHeader collapsed={!isMobileOpen && sidebarCollapsed} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <MainNavigation collapsed={!isMobileOpen && sidebarCollapsed} />
        </div>

        <SettingsPanel collapsed={!isMobileOpen && sidebarCollapsed} />
      </aside>
    </>
  );
};