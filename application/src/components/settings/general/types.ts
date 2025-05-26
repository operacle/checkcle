
import { GeneralSettings } from "@/services/settingsService";

export interface SettingsTabProps {
  form: any;
  isEditing: boolean;
  settings?: GeneralSettings;
}

export interface GeneralSettingsPanelProps {
  // No props needed for now, but we can add them in the future
}