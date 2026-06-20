
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { IncidentItem } from '@/services/incident/types';
import { Service } from '@/types/service.types';
import { useLanguage } from '@/contexts/LanguageContext';

interface IncidentsSectionProps {
  incidents: IncidentItem[];
  services: Service[];
}

const impactStatusLabel = (
  impactStatus: string | undefined,
  t: (k: string, m?: string) => string
): string => {
  switch (impactStatus) {
    case 'investigating':
      return t('incidentInvestigating', 'public');
    case 'identified':
      return t('incidentIdentified', 'public');
    case 'found_root_cause':
      return t('incidentFoundRootCause', 'public');
    case 'monitoring':
      return t('incidentMonitoring', 'public');
    default:
      return t('statusUnknown', 'public');
  }
};

export const IncidentsSection = ({ incidents, services }: IncidentsSectionProps) => {
  const { t } = useLanguage();

  if (!incidents || incidents.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-card-foreground text-xl">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          {t('activeIncidents', 'public')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.map((incident) => {
          const service = services.find((s) => s.id === incident.service_id);
          const affected = service?.name || incident.affected_systems;
          return (
            <div key={incident.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-card-foreground">{incident.title}</h3>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {impactStatusLabel(incident.impact_status, t)}
                </span>
              </div>
              {incident.description && (
                <p className="text-sm text-muted-foreground mt-2">{incident.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
                {affected && (
                  <span>
                    {t('affectedLabel', 'public')}: {affected}
                  </span>
                )}
                {incident.timestamp && (
                  <span>{format(new Date(incident.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
