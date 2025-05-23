
import React, { useState } from 'react';
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
import { MoreHorizontal, Eye, Edit, Trash, Play, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { maintenanceService } from '@/services/maintenance';
import { MaintenanceDetailDialog } from './detail-dialog/MaintenanceDetailDialog';
import { EditMaintenanceDialog } from './edit-dialog/EditMaintenanceDialog';

interface MaintenanceActionsMenuProps {
  item: MaintenanceItem;
  onMaintenanceUpdated: () => void;
}

export const MaintenanceActionsMenu = ({ item, onMaintenanceUpdated }: MaintenanceActionsMenuProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await maintenanceService.updateMaintenanceStatus(item.id, newStatus);
      toast({
        title: t('statusUpdated'),
        description: t('maintenanceStatusUpdated'),
      });
      onMaintenanceUpdated();
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingMaintenanceStatus'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await maintenanceService.deleteMaintenance(item.id);
      toast({
        title: t('maintenanceDeleted'),
        description: t('maintenanceDeletedDesc'),
      });
      onMaintenanceUpdated();
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingMaintenance'),
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Convert status to lowercase for consistent comparison
  const status = item.status.toLowerCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t('actions')}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('view')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t('edit')}
          </DropdownMenuItem>
          
          {status === 'scheduled' && (
            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
              <Play className="mr-2 h-4 w-4" />
              {t('markAsInProgress')}
            </DropdownMenuItem>
          )}
          
          {(status === 'scheduled' || status === 'in_progress') && (
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {t('markAsCompleted')}
            </DropdownMenuItem>
          )}
          
          {status !== 'cancelled' && (
            <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
              <X className="mr-2 h-4 w-4" />
              {t('markAsCancelled')}
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <MaintenanceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        maintenance={item}
      />
      
      <EditMaintenanceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        maintenance={item}
        onMaintenanceUpdated={onMaintenanceUpdated}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteMaintenanceConfirmation')}
              <span className="font-semibold"> {item.title}</span>?
              {t('thisActionCannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
