
import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { OverviewCard } from '../common/OverviewCard';

interface OverviewStatsProps {
  unresolved: number;
  resolved: number;
  critical: number;
  highPriority: number;
  avgResolutionTime: string;
}

interface OverviewCardsProps {
  overviewStats: OverviewStatsProps;
  loading: boolean;
  initialized: boolean;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ 
  overviewStats, 
  loading, 
  initialized 
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <OverviewCard
        title={t('activeIncidents')}
        value={overviewStats.unresolved.toString()}
        icon={<AlertCircle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        color="red"
      />
      <OverviewCard
        title={t('criticalIssues')}
        value={overviewStats.critical.toString()}
        icon={<AlertTriangle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        color="amber"
      />
      <OverviewCard
        title={t('highPriority')}
        value={overviewStats.highPriority.toString()}
        icon={<Flag className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        color="orange" 
      />
      <OverviewCard
        title={t('resolvedIncidents')}
        value={overviewStats.resolved.toString()}
        icon={<CheckCircle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        color="green"
      />
      <OverviewCard
        title={t('avgResolutionTime')}
        value={overviewStats.avgResolutionTime}
        icon={<Clock className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        color="blue"
      />
    </div>
  );
};
