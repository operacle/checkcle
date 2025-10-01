
export interface ServicesTranslations {

  serviceStatus: string;
  uptime: string;
  lastChecked: string;
  noServices: string;
  currentlyMonitoring: string;
  retry: string;
  overview: string;
  newService: string;
  rowsPerPage: string;
  search: string;
  allTypes: string;
  createNewService: string;
  createNewServiceDesc: string;

	// ServiceBasicFields.tsx
	serviceName: string;
	serviceNameDesc: string;

	// ServiceConfigFields.tsx
	checkInterval: string;
	seconds: string;
	minute: string;
	minutes: string;
	hour: string;
	hours: string;
	custom: string;
	checkIntervalPlaceholder: string;
	backToPresets: string;
	checkIntervalDesc: string;
	checkIntervalDescCustom: string;
	retryAttempts: string;
	attempt: string;
	attempts: string;
	retryAttemptsDesc: string;

	// ServiceForm.tsx
	updateService: string;
	createService: string;

	// ServiceNotificationFields.tsx
	enableNotifications: string;
	enableNotificationsDesc: string;
	notificationChannels: string;
	notificationChannelsEnabledDesc: string;
	notificationChannelsDesc: string;
	notificationChannelsPlaceholder: string;
	alertTemplate: string;
	alertTemplateLoading: string;
	alertTemplatePlaceholder: string;
	alertTemplateEnabledDesc: string;
	alertTemplateDesc: string;

	// ServiceTypeField.tsx
	serviceType: string;
	serviceTypeHTTPDesc: string;
	serviceTypePINGDesc: string;
	serviceTypeTCPDesc: string;
	serviceTypeDNSDesc: string;

	// ServiceRegionalFields.tsx
	regionalMonitoring: string;
	regionalMonitoringDesc: string;
	regionalAgents: string;
	regionalAgentsLoading: string;
	regionalAgentsAvailablePlaceholder: string;
	regionalAgentsAllSelected: string;
	regionalAgentsNoAvailable: string;
	regionalAgentsNoOnlineAvailable: string;
	regionalAgentsNotFoundMessage: string;
	regionalAgentsNotSelectedMessage: string;

	// ServiceUrlField.tsx
	targetDefault: string;
	targetDNS: string;
	targetHTTPDesc: string;
	targetPINGDesc: string;
	targetTCPDesc: string;
	targetTCPPortDesc: string;
	targetDNSDesc: string;
	targetDefaultDesc: string;
	targetDefaultPlaceholder: string;

	// types.ts
	serviceNameRequired: string;
	urlDomainHostRequired: string;
	enterValidUrlHostnameDomain: string;

	// Dashboard
	upServices: string;
	downServices: string;
	pausedServices: string;
	warningServices: string;

	// ServiceRowActions.tsx
	viewDetail: string;
	resumeMonitoring: string;
	pauseMonitoring: string;
	unmuteAlerts: string;
	muteAlerts: string;

	//IncidentTable.tsx
	responseTime: string;
	errorMessage: string;
	details: string;

	//LastCheckedTime.tsx
	pausedAt: string;
	lastCheckDetails: string;
	checkedAt: string;
	monitoringPaused: string;
	noAutomaticChecks: string;

	//ServiveEditDialog.tsx
	editService: string;
	editServiceDesc: string;

	//ServiceStatsCards.tsx
	lastCheckedAt: string;
	avg: string;
	lastUpChecksCount: string;
	basedOnlastChecksCount: string;
	totalUptime: string;
	totalDowntime: string;
	monitoringSettings: string;
	monitoringSettingsInterval: string;
	monitoringSettingsType: string;
	upStatusDuration: string;
	downStatusDuration: string;

	incidentHistory: string;
	processing: string;
	back: string;
	last20Checks: string;

	// OneClickInstallTab.tsx
	oneClickInstallTitle: string;
	oneClickInstallDesc: string;
	quickInstallCommand: string;
	copy: string;
	runCommandOnServer: string;
	sshIntoServer: string;
	pasteAndRun: string;
	agentInstalled: string;
	done: string;

	// DockerOneClickTab.tsx
	dockerOneClickTitle: string;
	dockerOneClickDesc: string;
	dockerOneClickCommand: string;
	dockerScriptWill: string;
	dockerScriptStep1: string;
	dockerScriptStep2: string;
	dockerScriptStep3: string;
	dockerScriptStep4: string;
	directDockerTitle: string;
	directDockerDesc: string;
	dockerRunCommand: string;
	dockerPrerequisites: string;
	dockerPrereqStep1: string;
	dockerPrereqStep2: string;
	dockerPrereqStep3: string;

	// ManualInstallTab.tsx
	manualInstallTitle: string;
	manualInstallDesc: string;
	serverName: string;
	agentId: string;
	osType: string;
	downloadScript: string;
	makeExecutable: string;
	runInstall: string;
	prerequisites: string;
	prereqRoot: string;
	prereqCurl: string;
	prereqInternet: string;
	afterInstall: string;
	agentWillStart: string;

	// ServerDetail.tsx
	errorLoadingServer: string;
	unableToFetchServerData: string;
	backToServers: string;
	loadingServerDetails: string;
	serverDetail: string;
	monitorServerMetrics: string;
	serverHostnameIpOs: string;

	// ContainerMonitoring.tsx
	errorLoadingContainers: string;
	unableToFetchContainerData: string;
	errorUnknown: string;
	containerMonitoring: string;
	monitorAndManageContainers: string;
	serverIdLabel: string;

	
}
