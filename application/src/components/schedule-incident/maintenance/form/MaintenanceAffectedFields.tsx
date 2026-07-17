
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/serviceService';

// Affected services are stored as a comma-separated list of service names in
// the `affected` text field. This control lets the user pick them from the
// uptime services instead of typing names by hand, while keeping that format.
const splitServices = (value: string): string[] =>
  value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

export const MaintenanceAffectedFields: React.FC = () => {
  const { t } = useLanguage();
  const { control } = useFormContext<MaintenanceFormValues>();

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
    staleTime: 300000,
  });

  return (
    <FormField
      control={control}
      name="affected"
      render={({ field }) => {
        const selected = splitServices(field.value);

        const addService = (name: string) => {
          if (name && !selected.includes(name)) {
            field.onChange([...selected, name].join(', '));
          }
        };

        const removeService = (name: string) => {
          field.onChange(selected.filter((s) => s !== name).join(', '));
        };

        return (
          <FormItem>
            <FormLabel>{t('affectedServices')}</FormLabel>
            <FormControl>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value=""
                onChange={(e) => addService(e.target.value)}
              >
                <option value="">{t('selectUptimeService')}</option>
                {services
                  .filter((service) => !selected.includes(service.name))
                  .map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
              </select>
            </FormControl>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((name) => (
                  <Badge
                    key={name}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2"
                  >
                    <span>{name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:opacity-70"
                      onClick={() => removeService(name)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('remove')}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
