
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarClock } from 'lucide-react';
import { 
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MaintenanceItem } from '@/services/types/maintenance.types';

interface MaintenanceDetailHeaderProps {
  maintenance: MaintenanceItem;
}

export const MaintenanceDetailHeader = ({ maintenance }: MaintenanceDetailHeaderProps) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'major':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'none':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <DialogHeader className="print:mb-6">
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock className="h-5 w-5 text-blue-500 print:hidden" />
        <DialogTitle className="text-xl">{maintenance.title}</DialogTitle>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge className={getStatusColor(maintenance.status)}>
          {maintenance.status}
        </Badge>
        <Badge className={getImpactColor(maintenance.field)}>
          {maintenance.field} {t('impact')}
        </Badge>
        <Badge className={getPriorityColor(maintenance.priority)}>
          {maintenance.priority} {t('priority')}
        </Badge>
      </div>
    </DialogHeader>
  );
};
