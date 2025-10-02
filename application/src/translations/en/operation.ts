
import { OperationTranslations } from '../types/operation';

export const operationTranslations: OperationTranslations = {

	// OperationalPageContent.tsx
	failedToLoadOperationalPages: "Failed to load operational pages",
	loadingoperationalPages: "There was an error loading your operational pages. Please try again.",
	tryagain: "Try Again",
	operationalPages: "Operational Pages",
  	describeOperation: "Manage your public status pages and monitor service health",
	refresh: "Refresh",
	noOperationalPagesFound: "No operational pages found",
	createYourFirstOperationalPage: "Create your first operational page to start monitoring your services and communicate status to your users.",
	totalPages: "Total Pages",
	publicPages: "Public Pages",
	operational: "Operational",
	deleteOperationalPage: "Delete Operational Page",
	deleteOperationalPageConfirm: 'Are you sure you want to delete "{title}"? This action cannot be undone and will permanently remove the operational page and all its components.',
	cancel: "Cancel",
	delete: "Delete",
	deleting: "Deleting...",

	// EditOperationalPageDialog.tsx
	editOperationalPage: "Edit Operational Page",
	updateYourOperationalPage: "Update your operational status page settings and manage components.",
	title: "Title",
	myServiceStatusPlaceholder: "My Service Status",
	slug: "Slug",
	myServiceStatusSlugPlaceholder: "my-service-status",
	description: "Description",
	operationalPageDescriptionPlaceholder: "A brief description of your operational page",
	theme: "Theme",
	selectTheme: "Select theme",
	themeDefault: "Default",
	themeDark: "Dark",
	themeLight: "Light",
	status: "Status",
	selectStatus: "Select status",
	statusOperational: "Operational",
	statusDegraded: "Degraded Performance",
	statusMaintenance: "Under Maintenance",
	statusMajorOutage: "Major Outage",
	publicPage: "Public Page",
	makePagePublic: "Make this page publicly accessible",
	customDomainOptional: "Custom Domain (Optional)",
	customDomainPlaceholder: "status.yourdomain.com",
	customDomainDescription: "Custom domain for your status page",
	cancelUpdate: "Cancel",
	updating: "Updating...",
	updatePage: "Update Page",

	// ComponentsSelector.tsx
	statusPageComponents: "Status Page Components",
	addMonitoringComponentsDesc: "Add monitoring components like uptime services, SSL certificates, and incident tracking",
	selectedComponents: "Selected Components",
	service: "Service",
	server: "Server",
	addComponent: "Add Component",
	componentName: "Component Name",
	componentNamePlaceholder: "e.g., Main Website",
	displayOrder: "Display Order",
	descriptionOptional: "Description (Optional)",
	descriptionPlaceholder: "Brief description of this component",
	uptimeServiceOptional: "Uptime Service (Optional)",
	selectUptimeService: "Select an uptime service",
	serverIdOptional: "Server ID (Optional)",
	serverIdPlaceholder: "server_456",
	cancelComponent: "Cancel",

	// OperationalPageCard.tsx
	public: "Public",
	yes: "Yes",
	no: "No",
	updated: "Updated",
	view: "View",
	edit: "Edit",

	// CreateOperationalPageDialog.tsx
	createOperationalPage: "Create Operational Page",
	createOperationalPageDesc: "Create a new operational status page to monitor your services and components.",
	createPage: "Create Page",
	creating: "Creating...",
	initialStatus: "Initial Status",

  
};