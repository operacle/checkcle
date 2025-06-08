
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { MainNavigation } from "./sidebar/MainNavigation";
import { SettingsPanel } from "./sidebar/SettingsPanel";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} ${theme === 'dark' ? 'bg-[#121212] border-[#1e1e1e]' : 'bg-sidebar border-sidebar-border'} border-r flex flex-col transition-all duration-300 h-full`}>
      <SidebarHeader collapsed={collapsed} />
      <MainNavigation collapsed={collapsed} />
      <SettingsPanel collapsed={collapsed} />
    </div>
  );
};