
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  const { t } = useLanguage();
  
  return (
    <Button variant="secondary" onClick={onClose}>
      {t('close')}
    </Button>
  );
};
