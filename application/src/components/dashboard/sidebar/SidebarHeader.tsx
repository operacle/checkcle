
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  const { theme } = useTheme();

  return (
    <div className={`p-4 ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-sidebar-border'} border-b flex items-center ${collapsed ? 'justify-center' : ''}`}>
      <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center mr-2">
        <span className="text-white font-bold">C</span>
      </div>
      {!collapsed && <h1 className="text-xl font-semibold">CheckCle App</h1>}
    </div>
  );
};