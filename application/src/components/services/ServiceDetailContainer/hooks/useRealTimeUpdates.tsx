
import { useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { Service, UptimeData } from "@/types/service.types";

interface UseRealTimeUpdatesProps {
  serviceId: string | undefined;
  startDate: Date;
  endDate: Date;
  setService: React.Dispatch<React.SetStateAction<Service | null>>;
  setUptimeData: React.Dispatch<React.SetStateAction<UptimeData[]>>;
}

export const useRealTimeUpdates = ({
  serviceId,
  startDate,
  endDate,
  setService,
  setUptimeData
}: UseRealTimeUpdatesProps) => {
  // Listen for real-time updates to this service
  useEffect(() => {
    if (!serviceId) return;

    console.log(`Setting up real-time updates for service: ${serviceId}`);
    
    try {
      // Subscribe to the service record for real-time updates
      const subscription = pb.collection('services').subscribe(serviceId, function(e) {
        console.log("Service updated:", e.record);
        
        // Update our local state with the new data
        if (e.record) {
          setService(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: e.record.status || prev.status,
              responseTime: e.record.response_time || e.record.responseTime || prev.responseTime,
              uptime: e.record.uptime || prev.uptime,
              lastChecked: e.record.last_checked || e.record.lastChecked || prev.lastChecked,
            };
          });
        }
      });

      // Subscribe to uptime data updates
      const uptimeSubscription = pb.collection('uptime_data').subscribe('*', function(e) {
        if (e.record && e.record.service_id === serviceId) {
          console.log("New uptime data:", e.record);
          
          // Add the new uptime data to our list if it's within the selected date range
          const timestamp = new Date(e.record.timestamp);
          if (timestamp >= startDate && timestamp <= endDate) {
            setUptimeData(prev => {
              const newData: UptimeData = {
                id: e.record.id,
                serviceId: e.record.service_id,
                timestamp: e.record.timestamp,
                status: e.record.status,
                responseTime: e.record.response_time || 0,
                date: e.record.timestamp, // Adding required date property
                uptime: e.record.uptime || 0 // Adding required uptime property
              };
              
              // Add at the beginning of the array to maintain newest first sorting
              return [newData, ...prev];
            });
          }
        }
      });

      // Clean up the subscriptions
      return () => {
        console.log(`Cleaning up subscriptions for service: ${serviceId}`);
        try {
          pb.collection('services').unsubscribe(serviceId);
          pb.collection('uptime_data').unsubscribe('*');
        } catch (error) {
          console.error("Error cleaning up subscriptions:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up real-time updates:", error);
    }
  }, [serviceId, startDate, endDate, setService, setUptimeData]);
};
