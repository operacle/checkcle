import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { LoadingState } from "@/components/services/LoadingState";
import { ServiceNotFound } from "@/components/services/ServiceNotFound";
import { Service } from "@/types/service.types";

interface ServiceDetailWrapperProps {
  children?: React.ReactNode;
  isLoading: boolean;
  service: Service | null;
  currentUser: any;
  handleLogout: () => void;
}

export const ServiceDetailWrapper = ({
  children,
  isLoading,
  service,
  currentUser,
  handleLogout
}: ServiceDetailWrapperProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
        
        {isLoading ? (
          <LoadingState />
        ) : !service ? (
          <ServiceNotFound />
        ) : (
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};