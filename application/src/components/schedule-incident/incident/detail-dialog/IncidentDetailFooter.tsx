
import React from 'react';
import { IncidentItem } from '@/services/incident';
import { Separator } from '@/components/ui/separator';
import { CloseButton, DownloadPdfButton, PrintButton } from './components';
import { useLanguage } from '@/contexts/LanguageContext';

interface IncidentDetailFooterProps {
  onClose: () => void;
  incident: IncidentItem;
}

export const IncidentDetailFooter: React.FC<IncidentDetailFooterProps> = ({
  onClose,
  incident,
}) => {
  const { t } = useLanguage();

  return (
    <div className="print:hidden">
      <Separator className="my-6" />
      <div className="flex justify-between items-center">
        <CloseButton onClose={onClose} />
        <div className="flex gap-2">
          <DownloadPdfButton incident={incident} />
          <PrintButton />
        </div>
      </div>
    </div>
  );
};
