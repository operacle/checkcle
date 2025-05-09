
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Service } from "@/types/service.types";
import { serviceService } from "@/services/serviceService"; 
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";

interface ServiceMonitoringButtonProps {
  service: Service;
  onStatusChange?: (newStatus: "up" | "down" | "paused" | "warning") => void;
}

export function ServiceMonitoringButton({ service, onStatusChange }: ServiceMonitoringButtonProps) {
  const [isMonitoring, setIsMonitoring] = useState(service.status !== "paused");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update local state when service prop changes
  useEffect(() => {
    setIsMonitoring(service.status !== "paused");
  }, [service.status]);

  const handleToggleMonitoring = async () => {
    try {
      setIsLoading(true);
      
      if (isMonitoring) {
        // Pause monitoring
        console.log(`Pausing monitoring for service ${service.id} (${service.name})`);
        await serviceService.pauseMonitoring(service.id);
        setIsMonitoring(false);
        
        if (onStatusChange) onStatusChange("paused");
        
        // Send notification for paused status (only here, not in pauseMonitoring.ts)
        if (service.alerts !== "muted") {
          console.log("Sending pause notification from UI component");
          // IMPORTANT: Direct call to the notification service to ensure a message is sent
          await notificationService.sendNotification({
            service: service,
            status: "paused",
            timestamp: new Date().toISOString(),
          });
        }
        
        toast({
          title: "Monitoring paused",
          description: `Monitoring for ${service.name} has been paused.`,
        });
      } else {
        // Start/resume monitoring
        console.log(`Starting monitoring for service ${service.id} (${service.name})`);
        
        // First ensure we update the status in the database to not be paused anymore
        await serviceService.resumeMonitoring(service.id);
        setIsMonitoring(true);
        
        // Perform an immediate check
        await serviceService.startMonitoringService(service.id);
        
        toast({
          title: "Monitoring resumed",
          description: `Monitoring for ${service.name} has been resumed. First check is running now.`,
        });
      }
    } catch (error) {
      console.error("Error toggling monitoring:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change monitoring status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline" 
      size="sm"
      onClick={handleToggleMonitoring}
      disabled={isLoading}
      className={isMonitoring ? "bg-red-900/20 hover:bg-red-900/30" : "bg-green-900/20 hover:bg-green-900/30"}
    >
      {isLoading ? (
        "Processing..."
      ) : isMonitoring ? (
        <>
          <Pause className="h-4 w-4 mr-2" />
          Pause Monitoring
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-2" />
          Start Monitoring
        </>
      )}
    </Button>
  );
}
