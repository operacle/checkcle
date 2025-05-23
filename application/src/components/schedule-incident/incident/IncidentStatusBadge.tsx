
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AlertCircle, 
  CheckCircle, 
  Gauge, 
  Search, 
  Wrench,
  LucideIcon
} from 'lucide-react';

interface IncidentStatusBadgeProps {
  status: string;
}

type StatusConfig = {
  label: string;
  variant: 'outline' | 'default' | 'secondary' | 'destructive';
  icon: LucideIcon;
  className?: string;
}

export const IncidentStatusBadge = ({ status }: IncidentStatusBadgeProps) => {
  const { t } = useLanguage();
  
  // Normalize the status string
  const normalizedStatus = (status || '').toLowerCase();
  
  // Status configuration map
  const statusConfigs: Record<string, StatusConfig> = {
    'investigating': {
      label: t('investigating'),
      variant: 'destructive',
      icon: Search,
      className: 'bg-red-100 border-red-200 text-red-700 hover:bg-red-100',
    },
    'identified': {
      label: t('identified'),
      variant: 'secondary',
      icon: AlertCircle,
      className: 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-100',
    },
    'found_root_cause': {
      label: t('rootCauseFound'),
      variant: 'secondary',
      icon: AlertCircle,
      className: 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-100',
    },
    'completed': {
      label: t('completed'),
      variant: 'default',
      icon: CheckCircle,
      className: 'bg-green-100 border-green-200 text-green-700 hover:bg-green-100',
    },
    'in_progress': {
      label: t('inProgress'),
      variant: 'default',
      icon: Wrench,
      className: 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-100',
    },
    'inprogress': {
      label: t('inProgress'),
      variant: 'default',
      icon: Wrench,
      className: 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-100',
    },
    'monitoring': {
      label: t('monitoring'),
      variant: 'outline',
      icon: Gauge,
      className: 'bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-100',
    },
    'resolved': {
      label: t('resolved'),
      variant: 'default',
      icon: CheckCircle,
      className: 'bg-green-100 border-green-200 text-green-700 hover:bg-green-100',
    }
  };
  
  // Find the appropriate config, defaulting to investigating if not found
  const getStatusConfig = (): StatusConfig => {
    for (const [key, config] of Object.entries(statusConfigs)) {
      if (normalizedStatus.includes(key)) {
        return config;
      }
    }
    return statusConfigs['investigating'];
  };
  
  const config = getStatusConfig();
  const Icon = config.icon;
  
  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center gap-1 ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};
