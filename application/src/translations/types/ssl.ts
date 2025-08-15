
export interface SSLTranslations {
  // Page and section titles
  sslDomainManagement: string;
  monitorSSLCertificates: string;
  addSSLCertificate: string;
  editSSLCertificate: string;
  deleteSSLCertificate: string;
  sslCertificateDetails: string;
  detailedInfo: string;
  viewDetailedInformation: string;

  // Status related
  valid: string;
  expiringSoon: string;
  expired: string;
  pending: string;

  // Statistics and cards
  validCertificates: string;
  expiringSoonCertificates: string;
  expiredCertificates: string;

  // Form fields
  domain: string;
  domainName: string;
  domainCannotChange: string;
  warningThreshold: string;
  warningThresholdDays: string;
  expiryThreshold: string;
  expiryThresholdDays: string;
  notificationChannel: string;
  chooseChannel: string;
  whereToSend: string;
  daysBeforeExpiration: string;
  daysBeforeCritical: string;
  getNotifiedExpiration: string;
  getNotifiedCritical: string;

  // Table headers and fields
  issuer: string;
  expirationDate: string;
  daysLeft: string;
  status: string;
  lastNotified: string;
  actions: string;
  validFrom: string;
  validUntil: string;
  validityDays: string;
  validityPeriod: string;
  organization: string;
  commonName: string;
  serialNumber: string;
  algorithm: string;
  subjectAltNames: string;
  subjectAlternativeNames: string;
  resolvedIP: string;
  issuedTo: string;
  days: string;
  
  // Buttons and actions
  addDomain: string;
  refreshAll: string;
  cancel: string;
  addCertificate: string;
  check: string;
  view: string;
  edit: string;
  delete: string;
  close: string;
  saveChanges: string;
  updating: string;
  
  // Sections in detail view
  basicInformation: string;
  validity: string;
  issuerInfo: string;
  technicalDetails: string;
  technicalInformation: string;
  monitoringConfig: string;
  monitoringConfiguration: string;
  recordInfo: string;
  certificateDetails: string;
  
  // Notifications and messages
  sslCertificateAdded: string;
  sslCertificateUpdated: string;
  sslCertificateDeleted: string;
  sslCertificateRefreshed: string;
  allCertificatesRefreshed: string;
  someCertificatesFailed: string;
  failedToAddCertificate: string;
  failedToLoadCertificates: string;
  failedToUpdateCertificate: string;
  failedToDeleteCertificate: string;
  failedToCheckCertificate: string;
  noCertificatesToRefresh: string;
  startingRefreshAll: string;
  checkingSSLCertificate: string;
  deleteConfirmation: string;
  deleteWarning: string;
  
  // Misc
  unknown: string;
  never: string;
  none: string;
  loadingChannels: string;
  noChannelsFound: string;
  noSSLCertificates: string;
  created: string;
  lastUpdated: string;
  lastNotification: string;
  collectionId: string;
  noCertificatesFound: string;
}