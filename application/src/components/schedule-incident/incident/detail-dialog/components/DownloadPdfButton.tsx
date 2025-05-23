
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDownloadIncidentPdf } from '../hooks';
import { IncidentItem } from '@/services/incident';

interface DownloadPdfButtonProps {
  incident: IncidentItem;
  className?: string;
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ 
  incident, 
  className 
}) => {
  const { t } = useLanguage();
  const { handleDownloadPDF } = useDownloadIncidentPdf();
  
  return (
    <Button
      className={`flex items-center gap-2 ${className || ''}`}
      onClick={() => handleDownloadPDF(incident)}
      variant="outline"
    >
      <Download className="h-4 w-4" />
      {t('downloadPdf', 'incident')}
    </Button>
  );
};
