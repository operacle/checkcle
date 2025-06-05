import { SettingsTranslations } from '../types/settings';

export const settingsTranslations: SettingsTranslations = {
  // Tabs
  systemSettings: "Systemeinstellungen",
  mailSettings: "E-Mail-Einstellungen",

  // System Settings
  appName: "Anwendungsname",
  appURL: "Anwendungs-URL",
  senderName: "Absendername",
  senderEmail: "Absender-E-Mail-Adresse",
  hideControls: "Steuerelemente ausblenden",

  // Mail Settings
  smtpSettings: "SMTP-Konfiguration",
  smtpEnabled: "SMTP aktivieren",
  smtpHost: "SMTP-Host",
  smtpPort: "SMTP-Port",
  smtpUsername: "SMTP-Benutzername",
  smtpPassword: "SMTP Password",
  smtpAuthMethod: "Authentifizierungsmethode",
  enableTLS: "TLS aktivieren",
  localName: "Lokaler Name",

  // Actions and status
  save: "Änderungen speichern",
  saving: "Speichere...",
  settingsUpdated: "Einstellungen erfolgreich aktualisiert",
  errorSavingSettings: "Fehler beim Speichern der Einstellungen",
  errorFetchingSettings: "Error loading settings",
  testConnection: "Verbindung testen",
  testingConnection: "Verbindung wird getestet...",
  connectionSuccess: "Verbindung erfolgreich",
  connectionFailed: "Verbindung fehlgeschlagen"
};
