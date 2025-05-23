
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateIncidentStatus, deleteIncident } from '@/services/incident/incidentOperations';
import { IncidentItem } from '@/services/incident/types';

interface IncidentActionsMenuProps {
  item: IncidentItem;
  onIncidentUpdated: () => void;
  onViewDetails?: (incident: IncidentItem) => void;
  onEditIncident?: (incident: IncidentItem) => void;
}

export const IncidentActionsMenu = ({ 
  item, 
  onIncidentUpdated,
  onViewDetails,
  onEditIncident
}: IncidentActionsMenuProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleResolveIncident = async () => {
    try {
      await updateIncidentStatus(item.id, 'resolved');
      toast({
        title: t('success'),
        description: t('incidentResolved'),
      });
      onIncidentUpdated();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast({
        title: t('error'),
        description: t('errorResolvingIncident'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteIncident = async () => {
    try {
      await deleteIncident(item.id);
      toast({
        title: t('success'),
        description: t('incidentDeleted'),
      });
      onIncidentUpdated();
    } catch (error) {
      console.error('Error deleting incident:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingIncident'),
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = () => {
    if (onEditIncident) {
      onEditIncident(item);
    } else {
      console.log(`Edit incident ${item.id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t('actions')}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onViewDetails && (
          <DropdownMenuItem onClick={() => onViewDetails(item)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('view')}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleResolveIncident}>
          <Check className="mr-2 h-4 w-4" />
          {t('resolve')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteIncident}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
