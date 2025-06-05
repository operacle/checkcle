
export interface SettingsTranslations {
  // Tabs
  systemSettings: string;
  mailSettings: string;
  
  // System Settings
  appName: string;
  appURL: string;
  senderName: string;
  senderEmail: string;
  hideControls: string;
  
  // Mail Settings
  smtpSettings?: string;
  smtpEnabled: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpAuthMethod: string;
  enableTLS: string;
  localName: string;
  
  // Actions and status
  save: string;
  saving: string;
  settingsUpdated: string;
  errorSavingSettings: string;
  errorFetchingSettings: string;
  testConnection: string;
  testingConnection: string;
  connectionSuccess: string;
  connectionFailed: string;
}