
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { useLanguage } from '@/contexts/LanguageContext';

interface MaintenanceSectionProps {
  maintenance: MaintenanceItem[];
}

const maintenanceStatusLabel = (
  status: string | undefined,
  t: (k: string, m?: string) => string
): string => {
  switch (status) {
    case 'in_progress':
      return t('maintenanceInProgress', 'public');
    case 'scheduled':
      return t('maintenanceScheduledStatus', 'public');
    default:
      return t('statusUnknown', 'public');
  }
};

const formatWindow = (start?: string, end?: string): string => {
  if (!start) return '';
  const startText = format(new Date(start), 'MMM dd, yyyy HH:mm');
  if (!end) return startText;
  return `${startText} – ${format(new Date(end), 'MMM dd, yyyy HH:mm')}`;
};

export const MaintenanceSection = ({ maintenance }: MaintenanceSectionProps) => {
  const { t } = useLanguage();

  if (!maintenance || maintenance.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-card-foreground text-xl">
          <Wrench className="h-6 w-6 text-blue-500" />
          {t('scheduledMaintenance', 'public')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {maintenance.map((item) => (
          <div key={item.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-card-foreground">{item.title}</h3>
              <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {maintenanceStatusLabel(item.status, t)}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
              {formatWindow(item.start_time, item.end_time) && (
                <span>{formatWindow(item.start_time, item.end_time)}</span>
              )}
              {item.affected && (
                <span>
                  {t('affectedLabel', 'public')}: {item.affected}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
