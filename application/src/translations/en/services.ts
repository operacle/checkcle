
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

	//ServiceStatsCards.tsx
	lastCheckedAt: "Last checked at {datetime}",
	avg: "Avg",
	lastUpChecksCount: "last {count} up checks",
	basedOnlastChecksCount: "Based on last {count} checks",
	totalUptime: "Total Uptime",
	totalDowntime: "Total Downtime",
	monitoringSettings: "Monitoring Settings",
	monitoringSettingsInterval: "Checked every {interval} seconds",
	monitoringSettingsType: "monitoring",
	upStatusDuration: "Up for {duration}",
	downStatusDuration: "Down for {duration}",

	incidentHistory: "Incident History",
	processing: "Processing",
	back: "Back",
	last20Checks: "Last 20 checks",

	//OneClickInstallTab.tsx
	oneClickInstallTitle: "One-Click Install (Recommended)",
	oneClickInstallDesc: "Copy and paste this single command to install the monitoring agent instantly",
	quickInstallCommand: "Quick Install Command",
	copy: "Copy",
	runCommandOnServer: "Simply run this command on your server:",
	sshIntoServer: "SSH into your target server",
	pasteAndRun: "Paste and run the command above",
	agentInstalled: "The agent will be installed and started automatically",
	done: "Done",

	// DockerOneClickTab.tsx
	dockerOneClickTitle: "Docker One-Click Install",
	dockerOneClickDesc: "Automated Docker container installation with system monitoring capabilities",
	dockerOneClickCommand: "Docker One-Click Command",
	dockerScriptWill: "This script will automatically:",
	dockerScriptStep1: "Download and setup the Docker monitoring agent",
	dockerScriptStep2: "Configure all required environment variables",
	dockerScriptStep3: "Start the container with proper system access",
	dockerScriptStep4: "Setup monitoring data persistence",
	directDockerTitle: "Direct Docker Run Command",
	directDockerDesc: "If you prefer to run the Docker container directly without the script",
	dockerRunCommand: "Docker Run Command",
	dockerPrerequisites: "Prerequisites for direct Docker run:",
	dockerPrereqStep1: "Docker must be installed and running",
	dockerPrereqStep2: "The operacle/checkcle-server-agent image must be available",
	dockerPrereqStep3: "Run as root or with sudo privileges",

	// ManualInstallTab.tsx
	manualInstallTitle: "Manual Installation Steps",
	manualInstallDesc: "Step-by-step installation process",
	serverName: "Server Name",
	agentId: "Agent ID",
	osType: "OS Type",
	downloadScript: "Download the installation script",
	makeExecutable: "Make the script executable",
	runInstall: "Run the installation with your configuration",
	prerequisites: "Prerequisites:",
	prereqRoot: "Ensure you have root/sudo access on the target server",
	prereqCurl: "Make sure curl is installed for downloading files",
	prereqInternet: "Internet connection required for downloading script",
	afterInstall: "After Installation:",
	agentWillStart: "The agent will start automatically and appear in your dashboard within a few minutes.",

	// ServerDetail.tsx
	errorLoadingServer: "Error loading server",
	unableToFetchServerData: "Unable to fetch server data. Please check your connection and try again.",
	backToServers: "Back to Servers",
	loadingServerDetails: "Loading server details...",
	serverDetail: "Server Detail",
	monitorServerMetrics: "Monitor server performance metrics and system health",
	serverHostnameIpOs: "{hostname} • {ip_address} • {os_type}",

	// ContainerMonitoring.tsx
	errorLoadingContainers: "Error loading containers",
	unableToFetchContainerData: "Unable to fetch container data. Please check your connection and try again.",
	errorUnknown: "Unknown error",
	containerMonitoring: "Container Monitoring",
	monitorAndManageContainers: "Monitor and manage your Docker containers in real-time",
	serverIdLabel: "Server ID",
};