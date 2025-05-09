
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Play, Pause, Edit, Bell, BellOff, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Service } from "@/types/service.types";
import { serviceService } from "@/services/serviceService";
import { useToast } from "@/hooks/use-toast";

interface ServiceRowActionsProps {
  service: Service;
  onViewDetail: (service: Service) => void;
  onPauseResume: (service: Service) => Promise<void>;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onMuteAlerts?: (service: Service) => Promise<void>;
}

export const ServiceRowActions = ({ 
  service, 
  onViewDetail,
  onPauseResume,
  onEdit,
  onDelete,
  onMuteAlerts
}: ServiceRowActionsProps) => {
  const { toast } = useToast();

  // Handle pause/resume directly from dropdown
  const handlePauseResume = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (service.status === "paused") {
        // Resume monitoring
        console.log(`Resuming monitoring for service ${service.id} (${service.name}) from dropdown`);
        
        // First ensure we update the status
        await serviceService.resumeMonitoring(service.id);
        
        // Then start monitoring service (performs an immediate check)
        await serviceService.startMonitoringService(service.id);
        
        toast({
          title: "Monitoring resumed",
          description: `Monitoring for ${service.name} has been resumed. First check is running now.`,
        });
      } else {
        // Pause monitoring
        console.log(`Pausing monitoring for service ${service.id} (${service.name}) from dropdown`);
        await serviceService.pauseMonitoring(service.id);
        
        toast({
          title: "Monitoring paused",
          description: `Monitoring for ${service.name} has been paused.`,
        });
      }
      
      // Call the parent handler to refresh the UI
      onPauseResume(service);
    } catch (error) {
      console.error("Error toggling monitoring:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change monitoring status. Please try again.",
      });
    }
  };

  // Check alerts status - check both fields for backward compatibility
  const alertsMuted = service.alerts === "muted" || service.muteAlerts === true;

  // Handle mute/unmute alerts
  const handleMuteAlerts = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onMuteAlerts) {
      try {
        console.log(`Attempting to ${alertsMuted ? 'unmute' : 'mute'} alerts for service ${service.id} (${service.name})`);
        await onMuteAlerts(service);
      } catch (error) {
        console.error("Error toggling alerts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to change alert settings. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            title="More options"
            className="opacity-70 hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-gray-900 border border-gray-800 text-white"
        >
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-base py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(service);
            }}
          >
            <Eye className="h-4 w-4" />
            <span>View Detail</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-base py-2.5"
            onClick={handlePauseResume}
          >
            {service.status === "paused" ? (
              <>
                <Play className="h-4 w-4" />
                <span>Resume Monitoring</span>
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Monitoring</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-base py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service);
            }}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-base py-2.5"
            onClick={handleMuteAlerts}
          >
            {alertsMuted ? (
              <>
                <Bell className="h-4 w-4" />
                <span>Unmute Alerts</span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                <span>Mute Alerts</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className="flex items-center gap-2 text-red-500 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-base py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
