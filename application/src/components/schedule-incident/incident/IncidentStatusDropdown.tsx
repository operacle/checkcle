
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CheckCircle, Gauge, Search, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateIncidentStatus } from '@/services/incident/incidentOperations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IncidentStatusBadge } from './IncidentStatusBadge';

interface IncidentStatusDropdownProps {
  status: string;
  id: string;
  onStatusUpdated: () => void;
  disabled?: boolean;
}

export const IncidentStatusDropdown = ({
  status,
  id,
  onStatusUpdated,
  disabled = false
}: IncidentStatusDropdownProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [localStatus, setLocalStatus] = React.useState(status);

  // Update local status when prop changes
  React.useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const statusOptions = [
    { value: 'investigating', label: t('investigating'), icon: <Search className="h-4 w-4 mr-2" /> },
    { value: 'identified', label: t('identified'), icon: <AlertCircle className="h-4 w-4 mr-2" /> },
    { value: 'found_root_cause', label: t('foundRootCause'), icon: <AlertCircle className="h-4 w-4 mr-2" /> },
    { value: 'in_progress', label: t('inProgress'), icon: <Wrench className="h-4 w-4 mr-2" /> },
    { value: 'monitoring', label: t('monitoring'), icon: <Gauge className="h-4 w-4 mr-2" /> },
    { value: 'resolved', label: t('resolved'), icon: <CheckCircle className="h-4 w-4 mr-2" /> },
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Don't update if the status is the same
      if (localStatus === newStatus) {
        return;
      }
      
      console.log(`Changing incident status from ${localStatus} to ${newStatus}`);
      
      // Optimistically update the UI immediately
      setLocalStatus(newStatus);
      
      // Make the API call in the background
      await updateIncidentStatus(id, newStatus);
      
      toast({
        title: t('statusUpdated'),
        description: t('incidentStatusUpdated'),
      });
      
      // Notify parent components about the status change
      onStatusUpdated();
      console.log('Status update complete, UI refresh triggered');
    } catch (error) {
      console.error('Error updating incident status:', error);
      
      // Revert to the original status on error
      setLocalStatus(status);
      
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
        <IncidentStatusBadge status={localStatus} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border border-border shadow-md z-50">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling to table row click
              handleStatusChange(option.value);
            }}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
