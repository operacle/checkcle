
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { 
  PrintButton,
  DownloadPdfButton,
  CloseButton
} from './components';

interface MaintenanceDetailFooterProps {
  maintenance: MaintenanceItem;
  onClose: () => void;
}

export const MaintenanceDetailFooter = ({ 
  maintenance,
  onClose
}: MaintenanceDetailFooterProps) => {
  return (
    <DialogFooter className="gap-2 sm:gap-2 mt-6 pt-4 border-t print:hidden">
      <PrintButton maintenance={maintenance} />
      <DownloadPdfButton maintenance={maintenance} />
      <CloseButton onClose={onClose} />
    </DialogFooter>
  );
};
