
import { pb } from "@/lib/pocketbase";
import { toast } from "@/hooks/use-toast";

export interface AlertConfiguration {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  service_id: string;
  notification_type: "telegram" | "discord" | "slack" | "signal" | "google_chat" | "email" | "ntfy" | "pushover" | "notifiarr" | "gotify" | "webhook";
  telegram_chat_id?: string;
  discord_webhook_url?: string;
  signal_number?: string;
  signal_api_endpoint?: string;
  notify_name: string;
  bot_token?: string;
  template_id?: string;
  slack_webhook_url?: string;
  google_chat_webhook_url?: string;
  enabled: boolean;
  created?: string;
  updated?: string;
  // Email specific fields
  email_address?: string;
  email_sender_name?: string;
  smtp_server?: string;
  smtp_port?: string;
  smtp_password?: string;
  webhook_id?: string;
  channel_id?: string;
  ntfy_endpoint?: string;
  api_token?: string;
  user_key?: string;
  server_url?: string;
  webhook_url?: string;
  webhook_payload_template?: string;
}

export const alertConfigService = {
  async getAlertConfigurations(): Promise<AlertConfiguration[]> {

    try {
      const response = await pb.collection('alert_configurations').getList(1, 50);
      return response.items as AlertConfiguration[];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
      return [];
    }
  },

  async createAlertConfiguration(config: Omit<AlertConfiguration, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>): Promise<AlertConfiguration | null> {
    
    try {
      // Build the configuration object with proper field mapping
      const cleanConfig: any = {
        service_id: config.service_id || "global",
        notification_type: config.notification_type,
        notify_name: config.notify_name,
        enabled: config.enabled,
        template_id: config.template_id || "",
      };

      // Add type-specific fields based on notification type
      if (config.notification_type === "telegram") {
        cleanConfig.telegram_chat_id = config.telegram_chat_id || "";
        cleanConfig.bot_token = config.bot_token || "";
      } else if (config.notification_type === "discord") {
        cleanConfig.discord_webhook_url = config.discord_webhook_url || "";
      } else if (config.notification_type === "slack") {
        cleanConfig.slack_webhook_url = config.slack_webhook_url || "";
      } else if (config.notification_type === "signal") {
        cleanConfig.signal_number = config.signal_number || "";
        cleanConfig.signal_api_endpoint = config.signal_api_endpoint || "";
      } else if (config.notification_type === "google_chat") {
        cleanConfig.google_chat_webhook_url = config.google_chat_webhook_url || "";
        
      } else if (config.notification_type === "email") {
       
        cleanConfig.email_address = config.email_address || "";
        cleanConfig.email_sender_name = config.email_sender_name || "";
        cleanConfig.smtp_server = config.smtp_server || "";
        cleanConfig.smtp_port = config.smtp_port || "";
        cleanConfig.smtp_password = config.smtp_password || "";
       
      } else if (config.notification_type === "ntfy") { 
        cleanConfig.ntfy_endpoint = config.ntfy_endpoint || "";
        cleanConfig.api_token = config.api_token || "";

      } else if (config.notification_type === "pushover") {       
        cleanConfig.api_token = config.api_token || "";
        cleanConfig.user_key = config.user_key || "";

      } else if (config.notification_type === "notifiarr") {   
        cleanConfig.api_token = config.api_token || "";
        cleanConfig.channel_id = config.channel_id || "";

      } else if (config.notification_type === "gotify") {      
        cleanConfig.api_token = config.api_token || "";
        cleanConfig.server_url = config.server_url || "";
        
      } else if (config.notification_type === "webhook") {
        cleanConfig.webhook_url = config.webhook_url || "";
        cleanConfig.webhook_payload_template = config.webhook_payload_template || "";
        
      }     
      const result = await pb.collection('alert_configurations').create(cleanConfig);
     
      toast({
        title: "Success",
        description: "Notification channel created successfully",
      });
      return result as AlertConfiguration;
    } catch (error) {
    
      // Try to get more details from the error
      if (error && typeof error === 'object') {
      }
      
      toast({
        title: "Error",
        description: "Failed to create notification channel",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateAlertConfiguration(id: string, config: Partial<AlertConfiguration>): Promise<AlertConfiguration | null> {
    try {
      // Build the update config with proper field mapping
      const updateConfig: any = {};
      
      // Copy all provided fields
      Object.keys(config).forEach(key => {
        if (config[key as keyof AlertConfiguration] !== undefined) {
          updateConfig[key] = config[key as keyof AlertConfiguration];
        }
      });
            
      const result = await pb.collection('alert_configurations').update(id, updateConfig);
      toast({
        title: "Success",
        description: "Notification channel updated successfully",
      });
      return result as AlertConfiguration;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification channel",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteAlertConfiguration(id: string): Promise<boolean> {
    try {
      await pb.collection('alert_configurations').delete(id);
      toast({
        title: "Success",
        description: "Notification channel removed",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove notification channel",
        variant: "destructive"
      });
      return false;
    }
  }
};