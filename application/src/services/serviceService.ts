
import { pb } from '@/lib/pocketbase';
import { Service, CreateServiceParams, UptimeData } from '@/types/service.types';
import { monitoringService } from './monitoring';
import { uptimeService } from './uptimeService';

export type { Service, UptimeData, CreateServiceParams };

export const serviceService = {
  async getServices(): Promise<Service[]> {
    try {
      const response = await pb.collection('services').getList(1, 50, {
        sort: 'name',
      });
      
      return response.items.map(item => ({
        id: item.id,
        name: item.name,
        url: item.url || "",  // Ensure proper URL mapping
        type: item.service_type || item.type || "HTTP",  // Map service_type to type
        status: item.status || "paused",
        responseTime: item.response_time || item.responseTime || 0,
        uptime: item.uptime || 0,
        lastChecked: item.last_checked || item.lastChecked || new Date().toLocaleString(),
        interval: item.heartbeat_interval || item.interval || 60,
        retries: item.max_retries || item.retries || 3,
        notificationChannel: item.notification_id,
        alertTemplate: item.template_id,
        muteAlerts: item.alerts === "muted",  // Convert string to boolean for compatibility
        alerts: item.alerts || "unmuted",     // Store actual database field
        muteChangedAt: item.mute_changed_at,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      throw new Error('Failed to load services data.');
    }
  },

  async createService(params: CreateServiceParams): Promise<Service> {
    try {
      // Convert service type to lowercase to avoid validation issues
      const serviceType = params.type.toLowerCase();
      
      // Debug log to check URL
      console.log("Creating service with URL:", params.url);
      
      const data = {
        name: params.name,
        url: params.url,  // Ensure URL is included
        service_type: serviceType,  // Using lowercase value to avoid validation errors
        status: "up", // Changed from "active" to "up" to match the expected enum values
        response_time: 0,
        uptime: 0,
        last_checked: new Date().toLocaleString(),
        heartbeat_interval: params.interval,
        max_retries: params.retries,
        notification_id: params.notificationChannel,
        template_id: params.alertTemplate,
      };

      console.log("Creating service with data:", data);
      const record = await pb.collection('services').create(data);
      console.log("Service created, returned record:", record);
      
      // Return the newly created service
      const newService = {
        id: record.id,
        name: record.name,
        url: record.url,  // Include the URL in returned service
        type: record.service_type || "http",
        status: record.status || "up", // Changed to match the status we set
        responseTime: record.response_time || 0,
        uptime: record.uptime || 0,
        lastChecked: record.last_checked || new Date().toLocaleString(),
        interval: record.heartbeat_interval || 60,
        retries: record.max_retries || 3,
        notificationChannel: record.notification_id,
        alertTemplate: record.template_id,
      } as Service;
      
      // Immediately start monitoring for the new service
      await monitoringService.startMonitoringService(record.id);
      
      return newService;
    } catch (error) {
      console.error("Error creating service:", error);
      throw new Error('Failed to create service.');
    }
  },
  
  async updateService(id: string, params: CreateServiceParams): Promise<Service> {
    try {
      // Convert service type to lowercase to avoid validation issues
      const serviceType = params.type.toLowerCase();
      
      // Debug log to check URL
      console.log("Updating service with URL:", params.url);
      
      const data = {
        name: params.name,
        url: params.url,  // Ensure URL is included
        service_type: serviceType,
        heartbeat_interval: params.interval,
        max_retries: params.retries,
        notification_id: params.notificationChannel || null,
        template_id: params.alertTemplate || null,
      };

      console.log("Updating service with data:", data);
      
      // Use timeout to ensure the request doesn't hang
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });
      
      const updatePromise = pb.collection('services').update(id, data);
      const record = await Promise.race([updatePromise, timeoutPromise]) as any;
      console.log("Service updated, returned record:", record);
      
      // Return the updated service
      const updatedService = {
        id: record.id,
        name: record.name,
        url: record.url,  // Include the URL in returned service
        type: record.service_type || "http",
        status: record.status,
        responseTime: record.response_time || 0,
        uptime: record.uptime || 0,
        lastChecked: record.last_checked || new Date().toLocaleString(),
        interval: record.heartbeat_interval || 60,
        retries: record.max_retries || 3,
        notificationChannel: record.notification_id,
        alertTemplate: record.template_id,
      } as Service;
      
      return updatedService;
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error(`Failed to update service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  // Control service monitoring
  startMonitoringService: monitoringService.startMonitoringService,
  pauseMonitoring: monitoringService.pauseMonitoring,
  resumeMonitoring: monitoringService.resumeMonitoring,
  checkHttpService: monitoringService.checkHttpService,
  startAllActiveServices: monitoringService.startAllActiveServices,
  
  // Re-export uptime functions
  recordUptimeData: uptimeService.recordUptimeData,
  getUptimeHistory: uptimeService.getUptimeHistory
};
