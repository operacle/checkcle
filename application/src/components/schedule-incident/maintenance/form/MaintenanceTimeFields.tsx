
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaintenanceFormValues } from '../hooks/useMaintenanceForm';
import { cn } from '@/lib/utils';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

export const MaintenanceTimeFields: React.FC = () => {
  const { t } = useLanguage();
  const { control } = useFormContext<MaintenanceFormValues>();

  // Helper function to safely format dates
  const safeFormat = (date: Date | null | undefined, formatStr: string): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return format(date, formatStr);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="start_time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('startTime')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value && field.value instanceof Date && !isNaN(field.value.getTime()) ? (
                      safeFormat(field.value, "PPP HH:mm")
                    ) : (
                      <span>{t('selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // If existing value is a valid date, preserve the time part
                      if (field.value instanceof Date && !isNaN(field.value.getTime())) {
                        const newDate = new Date(date);
                        newDate.setHours(field.value.getHours(), field.value.getMinutes());
                        field.onChange(newDate);
                      } else {
                        // Set default time to current time if no valid time exists
                        const now = new Date();
                        date.setHours(now.getHours(), now.getMinutes());
                        field.onChange(date);
                      }
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="p-3 border-t border-border">
                  <Input
                    type="time"
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (!timeValue) return;
                      
                      const [hours, minutes] = timeValue.split(':').map(Number);
                      const date = new Date(field.value || new Date());
                      
                      // Ensure we have a valid date before setting hours/minutes
                      if (!isNaN(date.getTime())) {
                        date.setHours(hours, minutes);
                        field.onChange(date);
                      }
                    }}
                    value={field.value instanceof Date && !isNaN(field.value.getTime()) 
                      ? safeFormat(field.value, "HH:mm") 
                      : ""}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="end_time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('endTime')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value && field.value instanceof Date && !isNaN(field.value.getTime()) ? (
                      safeFormat(field.value, "PPP HH:mm")
                    ) : (
                      <span>{t('selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // If existing value is a valid date, preserve the time part
                      if (field.value instanceof Date && !isNaN(field.value.getTime())) {
                        const newDate = new Date(date);
                        newDate.setHours(field.value.getHours(), field.value.getMinutes());
                        field.onChange(newDate);
                      } else {
                        // Set default time to current time if no valid time exists
                        const now = new Date();
                        // Default to current time + 1 hour for end time
                        date.setHours(now.getHours() + 1, now.getMinutes());
                        field.onChange(date);
                      }
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="p-3 border-t border-border">
                  <Input
                    type="time"
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (!timeValue) return;
                      
                      const [hours, minutes] = timeValue.split(':').map(Number);
                      const date = new Date(field.value || new Date());
                      
                      // Ensure we have a valid date before setting hours/minutes
                      if (!isNaN(date.getTime())) {
                        date.setHours(hours, minutes);
                        field.onChange(date);
                      }
                    }}
                    value={field.value instanceof Date && !isNaN(field.value.getTime()) 
                      ? safeFormat(field.value, "HH:mm")
                      : ""}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
