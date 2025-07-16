
import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { OverviewCard } from '../common/OverviewCard';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <OverviewCard
        title={t('activeIncidents')}
        value={overviewStats.unresolved.toString()}
        icon={<AlertCircle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        gradient={
          theme === "dark"
            ? "linear-gradient(135deg, #4b3b37 0%, rgba(239, 83, 80, 0.6) 100%)"
            : "linear-gradient(135deg, #4b3b37 0%, rgba(239, 83, 80, 0.6) 100%)"
        }
      />
      <OverviewCard
        title={t('criticalIssues')}
        value={overviewStats.critical.toString()}
        icon={<AlertTriangle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        gradient={
          theme === "dark"
            ? "linear-gradient(135deg, #4b3b37 0%, rgba(255, 183, 77, 0.6) 100%)"
            : "linear-gradient(135deg, #4b3b37 0%, rgba(255, 183, 77, 0.6) 100%)"
        }
      />
      <OverviewCard
        title={t('highPriority')}
        value={overviewStats.highPriority.toString()}
        icon={<Flag className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        gradient={
          theme === "dark"
            ? "linear-gradient(135deg, #4b3b37 0%, rgba(255, 109, 0, 0.6) 100%)"
            : "linear-gradient(135deg, #4b3b37 0%, rgba(255, 109, 0, 0.6) 100%)"
        }
      />
      <OverviewCard
        title={t('resolvedIncidents')}
        value={overviewStats.resolved.toString()}
        icon={<CheckCircle className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        gradient={
          theme === "dark"
            ? "linear-gradient(135deg, #4b3b37 0%, rgba(102, 187, 106, 0.6) 100%)"
            : "linear-gradient(135deg, #4b3b37 0%, rgba(102, 187, 106, 0.6) 100%)"
        }
      />
      <OverviewCard
        title={t('avgResolutionTime')}
        value={overviewStats.avgResolutionTime}
        icon={<Clock className="h-5 w-5 text-white" />}
        isLoading={loading && initialized}
        gradient={
          theme === "dark"
            ? "linear-gradient(135deg, #4b3b37 0%, rgba(66, 165, 245, 0.6) 100%)"
            : "linear-gradient(135deg, #4b3b37 0%, rgba(66, 165, 245, 0.6) 100%)"
        }
      />
    </div>
  );
};
