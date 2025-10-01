
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

  //NotificationSettings.ts
  titleNotification: string;
  descriptionChannelsServices: string;
  addChannel: string;
  all: string;
  telegram: string;
  discord: string;
  slack: string;
  signal: string;
  googleChat: string;
  email: string;
  webhook: string;

  // NotificationChannelDialog.tsx
  editChannel: string;
  addChannelDialog: string;
  channelName: string;
  channelNameDesc: string;
  channelType: string;
  selectType: string;
  enabled: string;
  enabledDesc: string;
  cancel: string;
  updateChannel: string;
  createChannel: string;
  payloadTemplates: string;
  availablePlaceholders: string;
  server: string;
  service: string;
  ssl: string;
  common: string;
  webhookUrl: string;
  webhookUrlDesc: string;
  payloadTemplate: string;
  payloadTemplateDesc: string;
  telegramChatId: string;
  telegramChatIdDesc: string;
  botToken: string;
  botTokenDesc: string;
  discordWebhookUrl: string;
  discordWebhookUrlDesc: string;
  slackWebhookUrl: string;
  slackWebhookUrlDesc: string;
  signalNumber: string;
  signalNumberDesc: string;
  signalApiEndpoint: string;
  signalApiEndpointDesc: string;
  googleChatWebhookUrl: string;
  googleChatWebhookUrlDesc: string;
  emailAddress: string;
  emailAddressDesc: string;
  emailSenderName: string;
  emailSenderNameDesc: string;
  smtpServer: string;
  // smtpPort: string;
  // smtpPassword: string;
  smtpPasswordDesc: string;
  ntfyEndpoint: string;
  ntfyEndpointDesc: string;
  apiToken: string;
  apiTokenOptional: string;
  apiTokenDesc: string;
  pushoverUserKey: string;
  pushoverUserKeyDesc: string;
  notifiarrChannelId: string;
  notifiarrChannelIdDesc: string;
  gotifyServerUrl: string;
  gotifyServerUrlDesc: string;
  errorSaveChannel: string;

  channelNamePlaceholder: string;
  telegramChatIdPlaceholder: string;
  botTokenPlaceholder: string;
  discordWebhookUrlPlaceholder: string;
  slackWebhookUrlPlaceholder: string;
  signalNumberPlaceholder: string;
  signalApiEndpointPlaceholder: string;
  googleChatWebhookUrlPlaceholder: string;
  emailAddressPlaceholder: string;
  emailSenderNamePlaceholder: string;
  smtpServerPlaceholder: string;
  smtpPortPlaceholder: string;
  smtpPasswordPlaceholder: string;
  ntfyEndpointPlaceholder: string;
  apiTokenPlaceholder: string;
  pushoverUserKeyPlaceholder: string;
  notifiarrChannelIdPlaceholder: string;
  gotifyServerUrlPlaceholder: string;
  webhookUrlPlaceholder: string;

  // DataRetentionSettings.tsx
  // permissionNotice: string;
  permissionNoticeDataRetention: string;
  loadingRetentionSettings: string;
  dataRetention: string;
  dataRetentionDescription: string;
  uptimeRetentionLabel: string;
  uptimeRetentionHelp: string;
  serverRetentionLabel: string;
  serverRetentionHelp: string;
  lastCleanup: string;
  // save: string;
}