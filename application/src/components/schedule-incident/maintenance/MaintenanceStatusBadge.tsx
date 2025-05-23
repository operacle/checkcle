
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarClock, Clock, CheckCircle, X } from 'lucide-react';

interface MaintenanceStatusBadgeProps {
  status: string;
}

export const MaintenanceStatusBadge = ({ status }: MaintenanceStatusBadgeProps) => {
  const { t } = useLanguage();

  // Ensure we have a string and normalize it
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';

  const getStatusColor = () => {
    switch (normalizedStatus) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in progress':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (normalizedStatus) {
      case 'scheduled':
        return <CalendarClock className="h-3 w-3" />;
      case 'in progress':
      case 'in_progress':
        return <Clock className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <X className="h-3 w-3" />;
      default:
        return <CalendarClock className="h-3 w-3" />;
    }
  };

  const getDisplayStatus = () => {
    switch (normalizedStatus) {
      case 'scheduled':
        return t('scheduled');
      case 'in progress':
      case 'in_progress':
        return t('inProgress');
      case 'completed':
        return t('completed');
      case 'cancelled':
        return t('cancelled');
      default:
        return status || '';
    }
  };

  return (
    <Badge className={`${getStatusColor()} flex items-center gap-1 font-medium`} variant="outline">
      {getStatusIcon()}
      {getDisplayStatus()}
    </Badge>
  );
};
