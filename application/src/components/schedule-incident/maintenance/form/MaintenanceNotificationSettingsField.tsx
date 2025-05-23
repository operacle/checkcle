
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { alertConfigService, AlertConfiguration } from '@/services/alertConfigService';
import { MaintenanceFormValues } from '../hooks/useMaintenanceForm';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, BellOff } from 'lucide-react';

export const MaintenanceNotificationSettingsField = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notificationChannels, setNotificationChannels] = useState<AlertConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { control, watch, setValue, getValues } = useFormContext<MaintenanceFormValues>();
  
  // Watch the notification toggle state
  const notifySubscribers = watch('notify_subscribers');
  const notificationChannelId = watch('notification_channel_id');
  
  useEffect(() => {
    const fetchNotificationChannels = async () => {
      try {
        setIsLoading(true);
        const channels = await alertConfigService.getAlertConfigurations();
        console.log("Fetched notification channels for form:", channels);
        
        // Only show enabled channels
        const enabledChannels = channels.filter(channel => channel.enabled);
        setNotificationChannels(enabledChannels);
        
        // If we have notification channels and notification is enabled but no channel is selected,
        // select the first one by default
        const currentChannel = getValues('notification_channel_id');
        const shouldNotify = getValues('notify_subscribers');
        
        console.log("Current notification values:", {
          currentChannel,
          shouldNotify,
          availableChannels: enabledChannels.length
        });
        
        if (shouldNotify && (!currentChannel || currentChannel === 'none') && enabledChannels.length > 0) {
          console.log("Setting default notification channel:", enabledChannels[0].id);
          setValue('notification_channel_id', enabledChannels[0].id);
        }
      } catch (error) {
        console.error('Error fetching notification channels:', error);
        toast({
          title: t('error'),
          description: t('errorFetchingNotificationChannels'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificationChannels();
  }, [t, toast, setValue, getValues]);
  
  // Log value changes for debugging
  useEffect(() => {
    console.log("Current notification settings:", {
      channel_id: getValues('notification_channel_id'),
      notify: notifySubscribers
    });
  }, [notifySubscribers, notificationChannelId, getValues]);
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">{t('notificationSettings')}</h3>
      
      <FormField
        control={control}
        name="notify_subscribers"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {field.value ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <FormLabel className="text-base mb-0">
                  {field.value ? t('notifySubscribers') : t('mutedNotifications')}
                </FormLabel>
              </div>
              <FormDescription>
                {field.value 
                  ? t('notifySubscribersDesc') 
                  : t('notificationsAreMuted')}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  console.log("Notification toggle changed to:", checked);
                  // If notifications are disabled, also clear the notification channel
                  if (!checked) {
                    setValue('notification_channel_id', '');
                  } else if (notificationChannels.length > 0) {
                    // If enabled and channels available, select the first one by default
                    setValue('notification_channel_id', notificationChannels[0].id);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="notification_channel_id"
        render={({ field }) => {
          // Make sure to handle both empty string and "none" as special cases
          const displayValue = field.value || "";
          
          console.log("Rendering notification channel field with value:", {
            fieldValue: field.value, 
            displayValue
          });
          
          return (
            <FormItem>
              <FormLabel>{t('notificationChannel')}</FormLabel>
              <FormControl>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select 
                    value={displayValue} 
                    onValueChange={(value) => {
                      console.log("Setting notification channel to:", value);
                      field.onChange(value === "none" ? "" : value);
                    }}
                    disabled={!notifySubscribers}
                  >
                    <SelectTrigger className={!notifySubscribers ? 'opacity-50' : ''}>
                      <SelectValue placeholder={t('selectNotificationChannel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        {t('none')}
                      </SelectItem>
                      {notificationChannels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.notify_name} ({channel.notification_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormDescription>
                {notifySubscribers
                  ? t('selectChannelForNotifications')
                  : t('enableNotificationsFirst')}
              </FormDescription>
            </FormItem>
          );
        }}
      />
    </div>
  );
};
