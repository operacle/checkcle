
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle } from 'lucide-react';

export const EmptyIncidentState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <AlertCircle className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">{t('noIncidents')}</h3>
      <p className="text-sm text-center max-w-md">
        {t('noServices')}
      </p>
    </div>
  );
};
