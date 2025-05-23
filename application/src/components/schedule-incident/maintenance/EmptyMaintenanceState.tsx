
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarClock } from 'lucide-react';

export const EmptyMaintenanceState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <CalendarClock className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">{t('noScheduledMaintenance')}</h3>
      <p className="text-sm text-center max-w-md">
        {t('noMaintenanceWindows')}
      </p>
    </div>
  );
};
