
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { Service } from "@/types/service.types";
import { serviceService } from "@/services/serviceService";
import { recordMuteStatusChange } from "@/services/monitoring/utils/notificationUtils";

export function useServiceActions(initialServices: Service[]) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Update services state when props change
  const updateServices = (newServices: Service[]) => {
    if (JSON.stringify(services) !== JSON.stringify(newServices)) {
      setServices(newServices);
    }
  };

  const handleViewDetail = (service: Service) => {
    navigate(`/service/${service.id}`);
  };
  
  const handlePauseResume = async (service: Service) => {
    try {
      if (service.status === "paused") {
        // Resume monitoring
        await serviceService.startMonitoringService(service.id);
        toast({
          title: "Service resumed",
          description: `${service.name} monitoring has been resumed successfully.`,
        });
        
        // Update local state - ensure status is properly typed as "up"
        const updatedServices = services.map(s => 
          s.id === service.id ? { ...s, status: "up" as const } : s
        );
        setServices(updatedServices);
      } else {
        // Pause monitoring
        await serviceService.pauseMonitoring(service.id);
        
        // Get the pause time and update local state
        const pauseTime = new Date().toISOString();
        const updatedServices = services.map(s => 
          s.id === service.id ? { ...s, status: "paused" as const, lastChecked: pauseTime } : s
        );
        setServices(updatedServices);
        
        toast({
          title: "Service paused",
          description: `${service.name} monitoring has been paused successfully.`,
        });
      }
      
      // Invalidate the services query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (error) {
      console.error("Error updating service status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status. Please try again.",
      });
    }
  };
  
  const handleEdit = (service: Service) => {
    setSelectedService({...service}); // Create a copy to avoid reference issues
    return service;
  };
  
  const handleDelete = (service: Service) => {
    setSelectedService(service);
    return service;
  };
  
  // Modified to return Promise<void> instead of Promise<boolean>
  const confirmDelete = async (): Promise<void> => {
    if (!selectedService || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      // First try to pause monitoring for this service to prevent any concurrency issues
      if (selectedService.status !== "paused") {
        await serviceService.pauseMonitoring(selectedService.id);
      }
      
      // Set a timeout to prevent hanging UI
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Delete request timed out")), 10000);
      });
      
      const deletePromise = pb.collection('services').delete(selectedService.id);
      await Promise.race([deletePromise, timeoutPromise]);
      
      toast({
        title: "Service deleted",
        description: `${selectedService.name} has been deleted successfully.`,
      });
      
      // Update local state
      const updatedServices = services.filter(s => s.id !== selectedService.id);
      setServices(updatedServices);
      
      // Invalidate the services query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["services"] });
      
      setSelectedService(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMuteAlerts = async (service: Service) => {
    try {
      // Check alerts status - check both fields for backward compatibility
      const isMuted = service.alerts === "muted" || service.muteAlerts === true;
      
      // Toggle the mute alerts status for this specific service
      const newMuteStatus = !isMuted;
      
      console.log(`${newMuteStatus ? "Muting" : "Unmuting"} alerts for service ${service.id} (${service.name})`);
      
      // First update the local state immediately for better UI responsiveness
      // Using proper type casting to ensure TypeScript knows we're creating valid Service objects
      const updatedServices = services.map(s => {
        if (s.id === service.id) {
          return {
            ...s,
            muteAlerts: newMuteStatus,
            alerts: newMuteStatus ? "muted" as const : "unmuted" as const
          };
        }
        return s;
      });
      
      setServices(updatedServices);
      
      // Record the mute status change (this will also update the service record)
      await recordMuteStatusChange(service.id, service.name, newMuteStatus);
      
      // Show a toast message
      toast({
        title: newMuteStatus ? "Alerts muted" : "Alerts unmuted",
        description: `Notifications for ${service.name} are now ${newMuteStatus ? "muted" : "enabled"}.`,
      });
      
      // Immediately invalidate the services query to trigger a refetch
      // This ensures our local state matches the database state
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      
    } catch (error) {
      console.error("Error updating alert settings:", error);
      
      // Revert the local state change if the server update failed
      const revertedServices = services.map(s => {
        if (s.id === service.id) {
          return {
            ...s,
            muteAlerts: service.muteAlerts,
            alerts: service.alerts
          };
        }
        return s;
      });
      
      setServices(revertedServices);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${!service.muteAlerts ? "mute" : "unmute"} alerts for ${service.name}. Please try again.`,
      });
    }
  };

  return {
    services,
    selectedService,
    isDeleting,
    setSelectedService,
    updateServices,
    handleViewDetail,
    handlePauseResume,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleMuteAlerts
  };
}
