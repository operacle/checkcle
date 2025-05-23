
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaintenanceFormValues } from '../hooks/useMaintenanceForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const MaintenanceAffectedFields: React.FC = () => {
  const { t } = useLanguage();
  const { control } = useFormContext<MaintenanceFormValues>();

  return (
    <FormField
      control={control}
      name="affected"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('affectedServices')}</FormLabel>
          <FormControl>
            <Input placeholder={t('enterAffectedServices')} {...field} />
          </FormControl>
          <FormMessage />
          <p className="text-sm text-muted-foreground">{t('separateServicesWithComma')}</p>
        </FormItem>
      )}
    />
  );
};
