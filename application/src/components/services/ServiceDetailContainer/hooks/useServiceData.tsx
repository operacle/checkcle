
import { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { Service, UptimeData } from "@/types/service.types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uptimeService } from "@/services/uptimeService";

export const useServiceData = (serviceId: string | undefined, startDate: Date, endDate: Date) => {
  const [service, setService] = useState<Service | null>(null);
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handler for service status changes
  const handleStatusChange = async (newStatus: "up" | "down" | "paused" | "warning") => {
    if (!service || !serviceId) return;

    try {
      // Optimistic UI update
      setService({ ...service, status: newStatus as Service["status"] });
      
      // Update the service status in PocketBase
      await pb.collection('services').update(serviceId, {
        status: newStatus
      });
      
      toast({
        title: "Status updated",
        description: `Service status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update service status:", error);
      // Revert the optimistic update
      setService(prevService => prevService);
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update service status. Please try again.",
      });
    }
  };

  // Function to fetch uptime data with date filters
  const fetchUptimeData = async (serviceId: string, start: Date, end: Date, selectedRange: string) => {
    try {
      console.log(`Fetching uptime data from ${start.toISOString()} to ${end.toISOString()}`);
      
      // Set appropriate limits based on time range to ensure enough granularity
      let limit = 200; // default
      
      // Adjust limits based on selected range
      if (selectedRange === '60min') {
        limit = 300; // More points for shorter time ranges
      } else if (selectedRange === '24h') {
        limit = 200;
      } else if (selectedRange === '7d') {
        limit = 250;
      } else if (selectedRange === '30d' || selectedRange === '1y') {
        limit = 300; // More points for longer time ranges
      }
      
      console.log(`Using limit ${limit} for range ${selectedRange}`);
      
      const history = await uptimeService.getUptimeHistory(serviceId, limit, start, end);
      console.log(`Fetched ${history.length} uptime records for time range ${selectedRange}`);
      
      if (history.length === 0) {
        console.log("No data returned from API, checking if we need to fetch with a higher limit");
        // If no data, try with a higher limit as fallback
        if (limit < 500) {
          const extendedHistory = await uptimeService.getUptimeHistory(serviceId, 500, start, end);
          console.log(`Fallback: Fetched ${extendedHistory.length} uptime records with higher limit`);
          
          if (extendedHistory.length > 0) {
            setUptimeData(extendedHistory);
            return extendedHistory;
          }
        }
      }
      
      // Sort data by timestamp (newest first)
      const sortedHistory = [...history].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setUptimeData(sortedHistory);
      return sortedHistory;
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
        
        // Add a timeout to prevent hanging
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
        
        // Fetch uptime history with date range
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
    if (serviceId && !isLoading) {
      fetchUptimeData(serviceId, startDate, endDate, '24h');
    }
  }, [startDate, endDate]);

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
