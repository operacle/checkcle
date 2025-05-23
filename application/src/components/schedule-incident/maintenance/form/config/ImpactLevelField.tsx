
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const ImpactLevelField = () => {
  const { t } = useLanguage();
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="field"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('impactLevel')}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('selectImpactLevel')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">{t('none')}</SelectItem>
              <SelectItem value="minor">{t('minor')}</SelectItem>
              <SelectItem value="major">{t('major')}</SelectItem>
              <SelectItem value="critical">{t('critical')}</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            {t('impactLevelDescription')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
