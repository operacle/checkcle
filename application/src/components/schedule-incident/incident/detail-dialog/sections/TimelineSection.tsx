
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem } from '@/services/incident';
import { formatDate } from './utils';

interface TimelineSectionProps {
  incident: IncidentItem | null;
  assignedUser?: any | null;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ incident }) => {
  const { t } = useLanguage();
  
  if (!incident) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('timeline')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('created')}</h4>
          <p className="mt-1">{formatDate(incident.created)}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('lastUpdated')}</h4>
          <p className="mt-1">{formatDate(incident.updated)}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('incidentTime')}</h4>
          <p className="mt-1">{formatDate(incident.timestamp)}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('resolutionTime')}</h4>
          <p className="mt-1">{formatDate(incident.resolution_time)}</p>
        </div>
      </div>
    </div>
  );
};

