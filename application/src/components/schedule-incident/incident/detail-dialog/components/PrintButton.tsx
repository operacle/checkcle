
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrintIncident } from '../hooks';

interface PrintButtonProps {
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ className }) => {
  const { t } = useLanguage();
  const { handlePrint } = usePrintIncident();
  
  return (
    <Button
      className={`flex items-center gap-2 ${className || ''}`}
      onClick={handlePrint}
      variant="default"
    >
      <Printer className="h-4 w-4" />
      {t('print', 'incident')}
    </Button>
  );
};
