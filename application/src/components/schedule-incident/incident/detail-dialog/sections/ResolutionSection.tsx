
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem } from '@/services/incident';

interface ResolutionSectionProps {
  incident: IncidentItem | null;
  assignedUser?: any | null;
}

export const ResolutionSection: React.FC<ResolutionSectionProps> = ({ incident }) => {
  const { t } = useLanguage();
  
  if (!incident) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('resolutionDetails')}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('rootCause')}</h4>
          <p className="mt-1 whitespace-pre-line">{incident.root_cause || '-'}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('resolutionSteps')}</h4>
          <p className="mt-1 whitespace-pre-line">{incident.resolution_steps || '-'}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('lessonsLearned')}</h4>
          <p className="mt-1 whitespace-pre-line">{incident.lessons_learned || '-'}</p>
        </div>
      </div>
    </div>
  );
};

