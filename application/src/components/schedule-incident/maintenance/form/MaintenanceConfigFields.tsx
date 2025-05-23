
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  PriorityField,
  StatusField,
  ImpactLevelField,
  AssignedUsersField
} from './config';

export const MaintenanceConfigFields = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="text-sm font-medium">{t('configurationSettings')}</div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PriorityField />
        <StatusField />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ImpactLevelField />
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-4">
        <AssignedUsersField />
      </div>
    </div>
  );
};
