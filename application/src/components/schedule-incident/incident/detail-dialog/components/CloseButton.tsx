
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClose,
  className 
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      variant="secondary" 
      onClick={onClose} 
      className={className}
    >
      {t('close', 'common')}
    </Button>
  );
};
