
export interface SettingsTranslations {
	// General Settings - Tabs
  systemSettings: string;
  mailSettings: string;
  
	// General Settings - System Settings
  appName: string;
  appURL: string;
  senderName: string;
  senderEmail: string;
  hideControls: string;
  
	// General Settings - Mail Settings
  smtpSettings?: string;
  smtpEnabled: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpAuthMethod: string;
  enableTLS: string;
  localName: string;

	// General Settings - Test Email
  testEmail: string;
  sendTestEmail: string;
  emailTemplate: string;
  verification: string;
  passwordReset: string;
  confirmEmailChange: string;
  otp: string;
  loginAlert: string;
  authCollection: string;
  selectCollection: string;
  toEmailAddress: string;
  enterEmailAddress: string;
	send: string;
  sending: string;
	testEmailSettings: string;
	testEmailDescription: string;
	testEmailAlert: string;

	// General Settings - Actions and status
  save: string;
  saving: string;
  settingsUpdated: string;
  errorSavingSettings: string;
  errorFetchingSettings: string;
  testConnection: string;
  testingConnection: string;
  connectionSuccess: string;
  connectionFailed: string;

  // User Management
	addUser: string;
	permissionNotice: string;
	permissionNoticeAddUser: string;
	loadingSettings: string;
	loadingSettingsError: string;
}