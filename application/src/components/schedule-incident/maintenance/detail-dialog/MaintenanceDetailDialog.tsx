
import React from 'react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { MaintenanceDetailContent } from './MaintenanceDetailContent';

interface MaintenanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: MaintenanceItem | null;
}

export const MaintenanceDetailDialog = ({
  open,
  onOpenChange,
  maintenance
}: MaintenanceDetailDialogProps) => {
  if (!maintenance) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="dialog-content sm:max-w-[700px] max-h-[90vh] overflow-y-auto 
                  print:max-w-none print:max-h-none print:overflow-visible 
                  print:shadow-none print:m-0 print:p-0 print:border-none
                  print:absolute print:left-0 print:top-0 print:w-full print:h-auto"
      >
        <MaintenanceDetailContent maintenance={maintenance} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
