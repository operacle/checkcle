
import { pb } from "@/lib/pocketbase";
import { toast } from "@/hooks/use-toast";

export interface AlertConfiguration {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  service_id: string;
  notification_type: "telegram" | "discord" | "signal" | "slack" | "email" | "wecom";
  telegram_chat_id?: string;
  discord_webhook_url?: string;
  signal_number?: string;
  notify_name: string;
  bot_token?: string;
  template_id?: string;
  slack_webhook_url?: string;
  wecom_webhook_url?: string;
  enabled: boolean;
  created?: string;
  updated?: string;
}

export const alertConfigService = {
  async getAlertConfigurations(): Promise<AlertConfiguration[]> {
   // console.info("Fetching alert configurations");
    try {
      const response = await pb.collection('alert_configurations').getList(1, 50);
    //  console.info("Alert configurations response:", response);
      return response.items as AlertConfiguration[];
    } catch (error) {
     // console.error("Error fetching alert configurations:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
      return [];
    }
  },

  async createAlertConfiguration(config: Omit<AlertConfiguration, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>): Promise<AlertConfiguration | null> {
   // console.info("Creating alert configuration:", config);
    try {
      const result = await pb.collection('alert_configurations').create(config);
    //  console.info("Alert configuration created:", result);
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
      return result as AlertConfiguration;
    } catch (error) {
    //  console.error("Error creating alert configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateAlertConfiguration(id: string, config: Partial<AlertConfiguration>): Promise<AlertConfiguration | null> {
  //  console.info(`Updating alert configuration ${id}:`, config);
    try {
      const result = await pb.collection('alert_configurations').update(id, config);
    //  console.info("Alert configuration updated:", result);
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
      return result as AlertConfiguration;
    } catch (error) {
   //   console.error("Error updating alert configuration:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteAlertConfiguration(id: string): Promise<boolean> {
  //  console.info(`Deleting alert configuration ${id}`);
    try {
      await pb.collection('alert_configurations').delete(id);
    //  console.info("Alert configuration deleted");
      toast({
        title: "Success",
        description: "Notification channel removed",
      });
      return true;
    } catch (error) {
    //  console.error("Error deleting alert configuration:", error);
      toast({
        title: "Error",
        description: "Failed to remove notification channel",
        variant: "destructive"
      });
      return false;
    }
  }
};
