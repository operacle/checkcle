
import { pb } from "@/lib/pocketbase";

export interface GeneralSettings {
  id: string;
  created: string;
  updated: string;
  system_name: string;
  system_name_kh?: string;
  logo_url?: string;
  system_description?: string;
  appearance?: string;
  language?: string;
  timezone?: string;
  date_format?: string;
  time_format?: string;
  retention_days?: number;
  server_retention_days?: number;
  uptime_retention_days?: number;
  notification_email?: string;
  session_timeout?: number;
  enable_public_stats?: boolean;
  enable_email_notifications?: boolean;
  enable_sms_notifications?: boolean;
  enable_two_factor?: boolean;
  enable_audit_logs?: boolean;
  
  // New fields for additional settings
  meta?: {
    appName?: string;
    appURL?: string;
    senderName?: string;
    senderAddress?: string;
    hideControls?: boolean;
  };
  smtp?: {
    enabled?: boolean;
    port?: number;
    host?: string;
    username?: string;
    authMethod?: string;
    tls?: boolean;
    localName?: string;
  };
}

export const settingsService = {
  async getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
      const result = await pb.collection('general_settings').getList(1, 1);
      if (result.items.length > 0) {
        // Type cast to GeneralSettings to resolve the type mismatch
        return result.items[0] as unknown as GeneralSettings;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch general settings:", error);
      return null;
    }
  },
  
  async updateGeneralSettings(id: string, data: Partial<GeneralSettings>): Promise<GeneralSettings | null> {
    try {
      // Type cast to GeneralSettings to resolve the type mismatch
      return await pb.collection('general_settings').update(id, data) as unknown as GeneralSettings;
    } catch (error) {
      console.error("Failed to update general settings:", error);
      return null;
    }
  },
  
  async testEmailConnection(smtpConfig: any): Promise<boolean> {
    try {
      // In a real application, we would send a test email here
      // For now, let's simulate a successful connection if the host is provided
      return !!smtpConfig.host;
    } catch (error) {
      console.error("Failed to test email connection:", error);
      return false;
    }
  }
};