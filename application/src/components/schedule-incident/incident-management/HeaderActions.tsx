
import React from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderActionsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onRefresh, isRefreshing }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>{t('incidentManagement')}</CardTitle>
        <CardDescription>
          {t('incidentsManagementDesc')}
        </CardDescription>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        className="ml-auto"
        title={t('refreshData')}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="sr-only">{t('refresh')}</span>
      </Button>
    </div>
  );
};
