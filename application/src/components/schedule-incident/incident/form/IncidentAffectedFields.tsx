
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentFormValues } from '../hooks/useIncidentForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const IncidentAffectedFields: React.FC = () => {
  const { t } = useLanguage();
  const { control } = useFormContext<IncidentFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="affected_systems"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('affectedSystems')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterAffectedSystems')} {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">{t('separateSystemsWithComma')}</p>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="root_cause"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('rootCause')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterRootCause')}
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
