import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Bell } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { AddSSLCertificateDto } from "@/types/ssl.types";
import { alertConfigService, AlertConfiguration } from "@/services/alertConfigService";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  warning_threshold: z.coerce.number().int().min(1).max(365),
  expiry_threshold: z.coerce.number().int().min(1).max(30),
  notification_channel: z.string().min(1, "Notification channel is required")
});

interface AddSSLCertificateFormProps {
  onSubmit: (data: AddSSLCertificateDto) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

export const AddSSLCertificateForm = ({ 
  onSubmit, 
  onCancel,
  isPending = false 
}: AddSSLCertificateFormProps) => {
  const { t } = useLanguage();
  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      warning_threshold: 30,
      expiry_threshold: 7,
      notification_channel: ""
    }
  });

  // Fetch notification channels when form loads
  useEffect(() => {
    const fetchNotificationChannels = async () => {
      setIsLoading(true);
      try {
        const configs = await alertConfigService.getAlertConfigurations();
        console.log("Fetched notification channels:", configs);
        // Only include enabled channels
        const enabledConfigs = configs.filter(config => {
          // Handle the possibility of enabled being a string
          if (typeof config.enabled === 'string') {
            return config.enabled === "true";
          }
          // Otherwise treat as boolean
          return config.enabled === true;
        });
        setAlertConfigs(enabledConfigs);
        
        // Set default if available, preferring Telegram channels
        const telegramChannel = enabledConfigs.find(c => c.notification_type === "telegram");
        const defaultChannel = telegramChannel || enabledConfigs[0];
        
        if (defaultChannel?.id) {
          form.setValue("notification_channel", defaultChannel.id);
        }
      } catch (error) {
        console.error("Error fetching notification channels:", error);
        toast.error(t('failedToLoadCertificates'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificationChannels();
  }, [form, t]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert the form values to the required DTO format with required properties
      const certData: AddSSLCertificateDto = {
        domain: values.domain,
        warning_threshold: values.warning_threshold,
        expiry_threshold: values.expiry_threshold,
        notification_channel: values.notification_channel
      };
      
      await onSubmit(certData);
      form.reset();
    } catch (error) {
      console.error("Error adding SSL certificate:", error);
      toast.error(t('failedToAddCertificate'));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('domain')}</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="warning_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('warningThreshold')}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                {t('getNotifiedExpiration')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiry_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expiryThreshold')}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                {t('getNotifiedCritical')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notification_channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('notificationChannel')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('chooseChannel')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alertConfigs.length > 0 ? (
                    alertConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id || ""}>
                        {config.notify_name} ({config.notification_type})
                      </SelectItem>
                    ))
                  ) : isLoading ? (
                    <SelectItem value="loading" disabled>{t('loadingChannels')}</SelectItem>
                  ) : (
                    <SelectItem value="none" disabled>{t('noChannelsFound')}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> 
                {t('chooseChannel')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" disabled={isPending || isLoading}>
            {t('addCertificate')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};