
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarClock, Clock, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { maintenanceService } from '@/services/maintenance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge';

interface MaintenanceStatusDropdownProps {
  status: string;
  id: string;
  onStatusUpdated: () => void;
  disabled?: boolean;
}

export const MaintenanceStatusDropdown = ({
  status,
  id,
  onStatusUpdated,
  disabled = false
}: MaintenanceStatusDropdownProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const statusOptions = [
    { value: 'scheduled', label: t('scheduled'), icon: <CalendarClock className="h-4 w-4 mr-2" /> },
    { value: 'in_progress', label: t('inProgress'), icon: <Clock className="h-4 w-4 mr-2" /> },
    { value: 'completed', label: t('completed'), icon: <CheckCircle className="h-4 w-4 mr-2" /> },
    { value: 'cancelled', label: t('cancelled'), icon: <X className="h-4 w-4 mr-2" /> },
  ];

  const handleStatusChange = async (newStatus: string) => {
    // Don't update if the status is the same
    if (status.toLowerCase() === newStatus) return;
    
    try {
      await maintenanceService.updateMaintenanceStatus(id, newStatus);
      
      toast({
        title: t('statusUpdated'),
        description: t('maintenanceStatusUpdated'),
      });
      
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      
      toast({
        title: t('error'),
        description: t('failedToUpdateStatus'),
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="w-full cursor-pointer">
        <MaintenanceStatusBadge status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-popover border border-border shadow-md">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex items-center cursor-pointer"
            onClick={() => handleStatusChange(option.value)}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

