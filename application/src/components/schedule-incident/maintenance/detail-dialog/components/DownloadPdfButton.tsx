
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDownloadMaintenancePdf } from '../hooks';
import { MaintenanceItem } from '@/services/maintenance';

interface DownloadPdfButtonProps {
  maintenance: MaintenanceItem;
  className?: string;
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ 
  maintenance, 
  className 
}) => {
  const { t } = useLanguage();
  const { handleDownloadPDF } = useDownloadMaintenancePdf();
  
  return (
    <Button
      className={`flex items-center gap-2 ${className || ''}`}
      onClick={() => handleDownloadPDF(maintenance)}
      variant="outline"
    >
      <Download className="h-4 w-4" />
      {t('downloadPdf')}
    </Button>
  );
};
