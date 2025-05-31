
import { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { Service, UptimeData } from "@/types/service.types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uptimeService } from "@/services/uptimeService";
import { DateRangeOption } from "../../DateRangeFilter";

export const useServiceData = (serviceId: string | undefined, startDate: Date, endDate: Date) => {
  const [service, setService] = useState<Service | null>(null);
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStatusChange = async (newStatus: "up" | "down" | "paused" | "warning") => {
    if (!service || !serviceId) return;

    try {
      setService({ ...service, status: newStatus as Service["status"] });
      
      await pb.collection('services').update(serviceId, {
        status: newStatus
      });
      
      toast({
        title: "Status updated",
        description: `Service status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update service status:", error);
      setService(prevService => prevService);
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update service status. Please try again.",
      });
    }
  };

  const fetchUptimeData = async (serviceId: string, start: Date, end: Date, selectedRange?: DateRangeOption | string) => {
    try {
      console.log(`Fetching uptime data: ${start.toISOString()} to ${end.toISOString()} for range: ${selectedRange}`);
      
      let limit = 500; // Default limit
      
      if (selectedRange === '24h') {
        limit = 300;
      } else if (selectedRange === '7d') {
        limit = 400;
      }
      
      console.log(`Using limit ${limit} for range ${selectedRange}`);
      
      const history = await uptimeService.getUptimeHistory(serviceId, limit, start, end);
      console.log(`Retrieved ${history.length} uptime records`);
      
      // Sort by timestamp (newest first)
      const filteredHistory = [...history].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setUptimeData(filteredHistory);
      return filteredHistory;
    } catch (error) {
      console.error("Error fetching uptime data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load uptime history. Please try again.",
      });
      return [];
    }
  };

  // Initial data loading
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        if (!serviceId) {
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 10000);
        });
        
        const fetchPromise = pb.collection('services').getOne(serviceId);
        const serviceData = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        const formattedService: Service = {
          id: serviceData.id,
          name: serviceData.name,
          url: serviceData.url || "",
          type: serviceData.service_type || serviceData.type || "HTTP",
          status: serviceData.status || "paused",
          responseTime: serviceData.response_time || serviceData.responseTime || 0,
          uptime: serviceData.uptime || 0,
          lastChecked: serviceData.last_checked || serviceData.lastChecked || new Date().toLocaleString(),
          interval: serviceData.heartbeat_interval || serviceData.interval || 60,
          retries: serviceData.max_retries || serviceData.retries || 3,
          notificationChannel: serviceData.notification_id,
          alertTemplate: serviceData.template_id,
          alerts: serviceData.alerts || "unmuted"
        };
        
        setService(formattedService);
        
        // Fetch initial uptime history with 24h default
        await fetchUptimeData(serviceId, startDate, endDate, '24h');
      } catch (error) {
        console.error("Error fetching service:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load service data. Please try again.",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServiceData();
  }, [serviceId, navigate, toast]);

  // Update data when date range changes
  useEffect(() => {
    if (serviceId && !isLoading && service) {
      console.log(`Date range changed, refetching data for ${serviceId}: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      fetchUptimeData(serviceId, startDate, endDate);
    }
  }, [startDate, endDate, serviceId, isLoading, service]);

  return {
    service,
    setService,
    uptimeData,
    setUptimeData,
    isLoading,
    handleStatusChange,
    fetchUptimeData
  };
};