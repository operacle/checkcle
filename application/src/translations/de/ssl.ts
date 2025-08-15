
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
  viewDetailedInformation: "View detailed information for",

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
  lastNotified: "Zuletzt benachrichtigt",
  actions: "Aktionen",
  validFrom: "Gültig von",
  validUntil: "Gültig bis",
  validityDays: "Gültigkeitsdauer Tage",
  validityPeriod: "Validity Period",
  organization: "Organisation",
  commonName: "Allgemeiner Name",
  serialNumber: "Seriennummer",
  algorithm: "Algorithmus",
  subjectAltNames: "Thema Alternative Bezeichnungen",
  subjectAlternativeNames: "Subject Alternative Names",
  resolvedIP: "Resolved IP",
  issuedTo: "Issued To",
  days: "days",
  
  // Buttons and actions
  addDomain: "Domain hinzufügen",
  refreshAll: "Alle aktualisieren",
  cancel: "Abbrechen",
  addCertificate: "Zertifikat hinzufügen",
  check: "Prüfen",
  view: "Ansehen",
  edit: "Bearbeiten",
  delete: "Löschen",
  close: "Schließen",
  saveChanges: "Änderungen speichern",
  updating: "Aktualisiere",

  // Sections in detail view
  basicInformation: "Basisinformationen",
  validity: "Gültigkeit",
  issuerInfo: "Informationen zum Aussteller",
  technicalDetails: "Technische Details",
  technicalInformation: "Technical Information",
  monitoringConfig: "Monitoring-Konfiguration",
  monitoringConfiguration: "Monitoring Configuration",
  recordInfo: "Aufzeichnungsinformationen",
  certificateDetails: "Certificate Details",

  // Notifications and messages
  sslCertificateAdded: "SSL-Zertifikat erfolgreich hinzugefügt",
  sslCertificateUpdated: "SSL-Zertifikat erfolgreich aktualisiert",
  sslCertificateDeleted: "SSL-Zertifikat erfolgreich gelöscht",
  sslCertificateRefreshed: "SSL-Zertifikat für {domain} erfolgreich aktualisiert",
  allCertificatesRefreshed: "Alle {count} Zertifikate wurden erfolgreich aktualisiert",
  someCertificatesFailed: "{success} Zertifikate aktualisiert, {failed} fehlgeschlagen",
  failedToAddCertificate: "Fehler beim Hinzufügen des SSL-Zertifikats",
  failedToLoadCertificates: "Fehler beim Laden der SSL-Zertifikate",
  failedToUpdateCertificate: "Fehler beim Aktualisieren des SSL-Zertifikats",
  failedToDeleteCertificate: "Fehler beim Löschen des SSL-Zertifikats",
  failedToCheckCertificate: "Fehler beim Prüfen des SSL-Zertifikats",
  noCertificatesToRefresh: "Keine Zertifikate zum Aktualisieren vorhanden",
  startingRefreshAll: "Starte Aktualisierung von {count} Zertifikaten",
  checkingSSLCertificate: "SSL-Zertifikat wird überprüft...",
  deleteConfirmation: "Möchten Sie das Zertifikat für wirklich löschen?",
  deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden. Das Zertifikat wird dauerhaft gelöscht.",

  // Misc
  unknown: "Unbekannt",
  never: "Nie",
  none: "Keine",
  loadingChannels: "Lade Kanäle...",
  noChannelsFound: "Keine Benachrichtigungskanäle gefunden",
  noSSLCertificates: "Keine SSL-Zertifikate gefunden",
  created: "Erstellt",
  lastUpdated: "Zuletzt aktualisiert",
  lastNotification: "Letzte Benachrichtigung",
  collectionId: "Sammlungs-ID",
  noCertificatesFound: "Keine Zertifikate gefunden",
}

