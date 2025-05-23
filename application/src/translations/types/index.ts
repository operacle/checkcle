
import { CommonTranslations } from './common';
import { MenuTranslations } from './menu';
import { LoginTranslations } from './login';
import { AboutTranslations } from './about';
import { ServicesTranslations } from './services';
import { MaintenanceTranslations } from './maintenance';
import { IncidentTranslations } from './incident';
import { SSLTranslations } from './ssl';
import { SettingsTranslations } from './settings';

export interface Translations {
  common: CommonTranslations;
  menu: MenuTranslations;
  login: LoginTranslations;
  about: AboutTranslations;
  services: ServicesTranslations;
  maintenance: MaintenanceTranslations;
  incident: IncidentTranslations;
  ssl: SSLTranslations;
  settings: SettingsTranslations;
}