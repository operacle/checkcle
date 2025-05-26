
export interface GeneralSettings {
  id?: string;
  created?: string;
  updated?: string;
  system_name?: string;
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
      console.log('Fetching settings from /api/settings endpoint...');
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'getSettings' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Settings API response:', result);
      
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Failed to fetch general settings:", error);
      return null;
    }
  },
  
  async updateGeneralSettings(data: Partial<GeneralSettings>): Promise<GeneralSettings | null> {
    try {
      console.log('Updating settings via /api/settings:', data);
      
      // Remove id and timestamp fields for settings update
      const { id, created, updated, ...updateData } = data;
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'updateSettings',
          data: updateData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Settings update response:', result);
      
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Failed to update general settings:", error);
      return null;
    }
  },
  
  async testEmailConnection(smtpConfig: any): Promise<boolean> {
    try {
      console.log('Testing email connection via /api/settings:', smtpConfig);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'testEmailConnection',
          data: smtpConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error("Failed to test email connection:", error);
      return false;
    }
  }
};