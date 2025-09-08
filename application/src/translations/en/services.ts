
import { ServicesTranslations } from '../types/services';

export const servicesTranslations: ServicesTranslations = {
  serviceStatus: "Service Status",
  uptime: "Uptime",
  lastChecked: "Last Checked",
  noServices: "No services match your filter criteria.",
  currentlyMonitoring: "Currently Monitoring",
  retry: "Retry",
  overview: "Overview",
  newService: "NewService",
  rowsPerPage: "Rows Per Page",
  search: "Search",
  allTypes: "All Types",
  createNewService: "Create New Service",
  createNewServiceDesc: "Fill in the details to create a new service to monitor.",

	// ServiceBasicFields.tsx
	serviceName: "Service Name",
	serviceNameDesc: "Enter a descriptive name for your service",

	// ServiceConfigFields.tsx
	checkInterval: "Check Interval",
	seconds: "seconds",
	minute: "minute",
	minutes: "minutes",
	hour: "hour",
	hours: "hours",
	custom: "Custom",
	checkIntervalPlaceholder: "Enter interval in seconds",
	backToPresets: "Back to presets",
	checkIntervalDesc: "How often to check the service status",
	checkIntervalDescCustom: "Enter custom interval in seconds (minimum 10 seconds)",
	retryAttempts: "Retry Attempts",
	attempt: "attempt",
	attempts: "attempts",
	retryAttemptsDesc: "Number of retry attempts before marking as down",

	// ServiceForm.tsx
	updateService: "Update Service",
	createService: "Create Service",

	// ServiceNotificationFields.tsx
	enableNotifications: "Enable Notifications",
	enableNotificationsDesc: "Enable or disable notifications for this service",
	notificationChannels: "Notification Channels",
	notificationChannelsEnabledDesc: "Select notification channels for this service",
	notificationChannelsDesc: "Enable notifications first to select channels",
	notificationChannelsPlaceholder: "Add a notification channel",
	alertTemplate: "Alert Template",
	alertTemplateLoading: "Loading templates...",
	alertTemplatePlaceholder: "Select an alert template",
	alertTemplateEnabledDesc: "Choose a template for alert messages",
	alertTemplateDesc: "Enable notifications first to select template",

	// ServiceTypeField.tsx
	serviceType: "Service Type",
	serviceTypeHTTPDesc: "Monitor websites and REST APIs with HTTP/HTTPS Protocol",
	serviceTypePINGDesc: "Monitor host availability with PING Protocol",
	serviceTypeTCPDesc: "Monitor TCP port connectivity with TCP Protocol",
	serviceTypeDNSDesc: "Monitor DNS resolution",

	// ServiceRegionalFields.tsx
	regionalMonitoring: "Regional Monitoring",
	regionalMonitoringDesc: "Assign this service to regional monitoring agents for distributed monitoring",
	regionalAgents: "Regional Agents",
	regionalAgentsLoading: "Loading agents...",
	regionalAgentsAvailablePlaceholder: "Select additional regional agents...",
	regionalAgentsAllSelected: "All available agents selected",
	regionalAgentsNoAvailable: "No regional agents available",
	regionalAgentsNoOnlineAvailable: "No online regional agents available",
	regionalAgentsNotFoundMessage: "No online regional agents found. Services will use default monitoring.",
	regionalAgentsNotSelectedMessage: "No regional agents selected. Service will use default monitoring.",

	// ServiceUrlField.tsx
	targetDefault: "Target URL/Host",
	targetDNS: "Domain Name",
	targetHTTPDesc: "Enter the full URL including protocol (http:// or https://)",
	targetPINGDesc: "Enter hostname or IP address to ping",
	targetTCPDesc: "Enter hostname or IP address for TCP connection test",
	targetTCPPortDesc: "Enter the port number for TCP connection test",
	targetDNSDesc: "Enter domain name for DNS record monitoring (A, AAAA, MX, etc.)",
	targetDefaultDesc: "Enter the target URL or hostname for monitoring",
	targetDefaultPlaceholder: "Enter URL or hostname",

	// types.ts
	serviceNameRequired: "Service name is required",
	urlDomainHostRequired: "URL/Domain/Host is required",
	enterValidUrlHostnameDomain: "Please enter a valid URL, hostname, or domain",

	// Dashboard
	upServices: "UP SERVICES",
	downServices: "DOWN SERVICES",
	pausedServices: "PAUSED SERVICES",
	warningServices: "WARNING SERVICES",

	// ServiceRowActions.tsx
	viewDetail: "View Detail",
	resumeMonitoring: "Resume Monitoring",
	pauseMonitoring: "Pause Monitoring",


	//IncidentTable.tsx
	responseTime: "Response Time",
	errorMessage: "Error Message",
	details: "Details",
	unmuteAlerts: "Unmute Alerts",
	muteAlerts: "Mute Alerts",

	//LastCheckedTime.tsx
	pausedAt: "Paused at ",
	lastCheckDetails: "Last Check Details",
	checkedAt: "Checked at ",
	monitoringPaused: "Monitoring Paused",
	noAutomaticChecks: "No automatic checks",

	//ServiveEditDialog.tsx
	editService: "Edit Service",
	editServiceDesc: "Update the details of your monitored service.",


	incidentHistory: "Incident History",
	processing: "Processing",
	back: "Back",


};