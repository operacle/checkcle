
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
import { Textarea } from '@/components/ui/textarea';

export const IncidentDetailsFields: React.FC = () => {
  const { t } = useLanguage();
  const { control } = useFormContext<IncidentFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="resolution_steps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resolutionSteps')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterResolutionSteps')}
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="lessons_learned"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('lessonsLearned')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterLessonsLearned')}
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

