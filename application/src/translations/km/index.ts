
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
import { instanceTranslations } from './instance';
import { operationTranslations } from './operation';
import { regionTranslations } from './region';
import { dockerTranslations } from './docker';
import { publicTranslations } from './public';

const enTranslations: Translations = {
  common: commonTranslations,
  menu: menuTranslations,
  login: loginTranslations,
  about: aboutTranslations,
  services: servicesTranslations,
  maintenance: maintenanceTranslations,
  incident: incidentTranslations,
  ssl: sslTranslations,
  settings: settingsTranslations,
  instance: instanceTranslations,
  operation: operationTranslations,
  region: regionTranslations,
  docker: dockerTranslations,
  public: publicTranslations
  
};

export default enTranslations;