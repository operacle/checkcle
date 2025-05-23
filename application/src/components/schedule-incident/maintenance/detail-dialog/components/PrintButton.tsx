
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrintMaintenance } from '../hooks/usePrintMaintenance';
import { MaintenanceItem } from '@/services/types/maintenance.types';

interface PrintButtonProps {
  maintenance: MaintenanceItem;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ maintenance }) => {
  const { t } = useLanguage();
  const { handlePrint } = usePrintMaintenance();
  
  return (
    <Button
      className="flex items-center gap-2"
      onClick={() => handlePrint(maintenance)}
      variant="default"
    >
      <Printer className="h-4 w-4" />
      {t('print')}
    </Button>
  );
};
