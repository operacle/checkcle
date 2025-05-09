
import { ArrowLeft, Globe, MoreVertical, FileText, Github, Twitter, MessageSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/services/StatusBadge";
import { ServiceMonitoringButton } from "@/components/services/ServiceMonitoringButton";
import { Service } from "@/types/service.types";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ServiceHeaderProps {
  service: Service;
  onStatusChange?: (newStatus: "up" | "down" | "paused" | "warning") => void;
}

export function ServiceHeader({ service, onStatusChange }: ServiceHeaderProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent" 
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{service.name}</h1>
          
          {/* Pulsating Circle Animation */}
          <div className="relative ml-2 flex items-center">
            <span 
              className={cn(
                "flex h-3 w-3 relative",
                service.status === "up" ? "bg-green-500" : 
                service.status === "down" ? "bg-red-500" :
                service.status === "warning" ? "bg-yellow-500" : 
                "bg-blue-500",
                "rounded-full"
              )}
            />
            <span 
              className={cn(
                "animate-ping absolute h-3 w-3",
                service.status === "up" ? "bg-green-400" : 
                service.status === "down" ? "bg-red-400" :
                service.status === "warning" ? "bg-yellow-400" : 
                "bg-blue-400",
                "rounded-full opacity-75"
              )}
            />
          </div>
          
          {service.url && (
            <a 
              href={service.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary text-sm flex items-center mt-1 ml-1"
            >
              <Globe className="h-3 w-3 mr-1" />
              {service.url}
            </a>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <StatusBadge status={service.status} size="lg" />
          <ServiceMonitoringButton service={service} onStatusChange={onStatusChange} />
          <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-border">
            <span className="sr-only">More options</span>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
