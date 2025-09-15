import React, { createContext, useContext, useState, useEffect } from "react";
type SideBar = boolean;

interface SidebarContextType {
  sidebarCollapsed: SideBar;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<SideBar>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
interface SidebarProviderProps {
  children: React.ReactNode;
}
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  // Initialize the state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<SideBar>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", newState.toString());
      return newState;
    });
  };

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

// A custom hook to consume the sidebar context.
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
