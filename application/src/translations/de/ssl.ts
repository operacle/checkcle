
import { SSLTranslations } from '../types/ssl';

export const sslTranslations: SSLTranslations = {
  // Page and section titles
  sslDomainManagement: "SSL- & Domainverwaltung",
  monitorSSLCertificates: "SSL-Zertifikate und deren Ablaufdaten überwachen",
  addSSLCertificate: "SSL-Zertifikat hinzufügen",
  editSSLCertificate: "SSL-Zertifikat bearbeiten",
  deleteSSLCertificate: "Delete SSL Certificate",
  sslCertificateDetails: "SSL-Zertifikatdetails",
  detailedInfo: "Detaillierte Informationen zum SSL-Zertifikat für",

  // Status related
  valid: "Gültig",
  expiringSoon: "Läuft bald ab",
  expired: "Abgelaufen",
  pending: "Ausstehend",

  // Statistics and cards
  validCertificates: "Gültige Zertifikate",
  expiringSoonCertificates: "Läuft bald ab",
  expiredCertificates: "Abgelaufen",

  // Form fields
  domain: "Domain",
  domainName: "Domainname",
  domainCannotChange: "Domainname kann nicht geändert werden. Um eine andere Domain zu überwachen, fügen Sie ein neues Zertifikat hinzu.",
  warningThreshold: "Warnschwelle (Tage)",
  warningThresholdDays: "Warnschwelle (Tage)",
  expiryThreshold: "Ablaufschwelle (Tage)",
  expiryThresholdDays: "Ablaufschwelle (Tage)",
  notificationChannel: "Benachrichtigungskanal",
  chooseChannel: "Wählen Sie, wo Sie Benachrichtigungen erhalten möchten",
  whereToSend: "Wohin die Benachrichtigungen gesendet werden sollen",
  daysBeforeExpiration: "Tage vor Ablauf zur Warnung",
  daysBeforeCritical: "Tage vor Ablauf zur kritischen Warnung",
  getNotifiedExpiration: "Benachrichtigung erhalten, wenn Zertifikate bald ablaufen",
  getNotifiedCritical: "Benachrichtigung erhalten, wenn Zertifikate kritisch kurz vor Ablauf stehen",

  // Table headers and fields
  issuer: "Aussteller",
  expirationDate: "Ablaufdatum",
  daysLeft: "Verbleibende Tage",
  status: "Status",
  lastNotified: "Last Notified",
  actions: "Actions",
  validFrom: "Valid From",
  validUntil: "Valid Until",
  validityDays: "Validity Days",
  organization: "Organization",
  commonName: "Common Name",
  serialNumber: "Serial Number",
  algorithm: "Algorithm",
  subjectAltNames: "Subject Alternative Names",
  
  // Buttons and actions
  addDomain: "Add Domain",
  refreshAll: "Refresh All",
  cancel: "Cancel",
  addCertificate: "Add Certificate",
  check: "Check",
  view: "View",
  edit: "Edit",
  delete: "Delete",
  close: "Close",
  saveChanges: "Save Changes",
  updating: "Updating",
  
  // Sections in detail view
  basicInformation: "Basic Information",
  validity: "Validity",
  issuerInfo: "Issuer Information",
  technicalDetails: "Technical Details",
  monitoringConfig: "Monitoring Configuration",
  recordInfo: "Record Information",
  
  // Notifications and messages
  sslCertificateAdded: "SSL Certificate added successfully",
  sslCertificateUpdated: "SSL Certificate updated successfully",
  sslCertificateDeleted: "SSL Certificate deleted successfully",
  sslCertificateRefreshed: "SSL Certificate for {domain} refreshed successfully",
  allCertificatesRefreshed: "All {count} certificates refreshed successfully",
  someCertificatesFailed: "{success} certificates refreshed, {failed} failed",
  failedToAddCertificate: "Failed to add SSL certificate",
  failedToLoadCertificates: "Failed to load SSL certificates",
  failedToUpdateCertificate: "Failed to update SSL certificate",
  failedToDeleteCertificate: "Failed to delete SSL certificate",
  failedToCheckCertificate: "Failed to check SSL certificate",
  noCertificatesToRefresh: "No certificates to refresh",
  startingRefreshAll: "Starting refresh of {count} certificates",
  checkingSSLCertificate: "Checking SSL certificate...",
  deleteConfirmation: "Are you sure you want to delete the certificate for",
  deleteWarning: "This action cannot be undone. This will permanently delete the certificate.",
  
  // Misc
  unknown: "Unknown",
  never: "Never",
  none: "None",
  loadingChannels: "Loading channels...",
  noChannelsFound: "No notification channels found",
  noSSLCertificates: "No SSL certificates found",
  created: "Created",
  lastUpdated: "Last Updated",
  lastNotification: "Last Notification",
  collectionId: "Collection ID"
};
