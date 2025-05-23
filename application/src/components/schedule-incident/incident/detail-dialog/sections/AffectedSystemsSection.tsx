
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem } from '@/services/incident';
import { Badge } from '@/components/ui/badge';
import { getAffectedSystemsArray } from './utils';

interface AffectedSystemsSectionProps {
  incident: IncidentItem | null;
  assignedUser?: any | null;
}

export const AffectedSystemsSection: React.FC<AffectedSystemsSectionProps> = ({ incident }) => {
  const { t } = useLanguage();
  
  if (!incident) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('affectedSystems')}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t('systems')}</h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {getAffectedSystemsArray(incident.affected_systems).map((system, idx) => (
              <Badge key={idx} variant="outline">{system}</Badge>
            ))}
            {getAffectedSystemsArray(incident.affected_systems).length === 0 && 
              <span className="text-muted-foreground italic">{t('noSystems')}</span>
            }
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{t('impact')}</h4>
            <div className="mt-1">
              <Badge variant={
                incident.impact?.toLowerCase() === 'critical' ? 'destructive' :
                incident.impact?.toLowerCase() === 'high' ? 'default' :
                incident.impact?.toLowerCase() === 'medium' ? 'secondary' : 'outline'
              }>
                {t(incident.impact?.toLowerCase() || 'low')}
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{t('priority')}</h4>
            <div className="mt-1">
              <Badge variant={
                incident.priority?.toLowerCase() === 'critical' ? 'destructive' :
                incident.priority?.toLowerCase() === 'high' ? 'default' :
                incident.priority?.toLowerCase() === 'medium' ? 'secondary' : 'outline'
              }>
                {t(incident.priority?.toLowerCase() || 'low')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

