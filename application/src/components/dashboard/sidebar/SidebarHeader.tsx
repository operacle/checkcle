import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-[15.7px] ${
        theme === "dark"
          ? "border-[#1e1e1e] bg-black"
          : "border-sidebar-border bg-white"
      } border-b flex items-center  ${collapsed ? "justify-center" : ""}`}
    >
      <div className="h-8 w-8 rounded flex items-center justify-center mr-2 dark:bg-drak">
        <img src="/favicon_sidebar.ico" alt="CheckCle" className="h-7 w-6" />
      </div>
      {!collapsed && <h1 className="text-xl font-semibold">CheckCle App</h1>}
    </div>
  );
};
