
import { Translations } from '../types';
import { commonTranslations } from './common';
import { menuTranslations } from './menu';
import { loginTranslations } from './login';
import { aboutTranslations } from './about';
import { servicesTranslations } from './services';
import { maintenanceTranslations } from './maintenance';
import { incidentTranslations } from './incident';
import { sslTranslations } from './ssl';
import { settingsTranslations } from './settings';

const enTranslations: Translations = {
  common: commonTranslations,
  menu: menuTranslations,
  login: loginTranslations,
  about: aboutTranslations,
  services: servicesTranslations,
  maintenance: maintenanceTranslations,
  incident: incidentTranslations,
  ssl: sslTranslations,
  settings: settingsTranslations
};

export default enTranslations;