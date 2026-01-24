
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Bell, X } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AddSSLCertificateDto } from "@/types/ssl.types";
import { alertConfigService, AlertConfiguration } from "@/services/alertConfigService";
import { sslNotificationTemplateService, SslNotificationTemplate } from "@/services/sslNotificationTemplateService";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const formSchema = z.object({
    domain: z.string()
      .min(1, t("domain") + " is required")
      .refine(
        (value) => !/\s/.test(value),
        t("spacesNotAllowed")
      ),
    warning_threshold: z.coerce.number().int().min(1).max(365),
    expiry_threshold: z.coerce.number().int().min(1).max(30),
    notification_channels: z.array(z.string()).optional(),
    alert_template: z.string().optional(),
    check_interval: z.coerce.number().int().min(1).max(30).optional()
  });

  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  const [sslTemplates, setSslTemplates] = useState<SslNotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      warning_threshold: 30,
      expiry_threshold: 7,
      notification_channels: [],
      alert_template: "none",
      check_interval: 1
    }
  });

  // Fetch notification channels and SSL templates when form loads
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch notification channels
        const configs = await alertConfigService.getAlertConfigurations();
        const enabledConfigs = configs.filter(config => {
          if (typeof config.enabled === 'string') {
            return config.enabled === "true";
          }
          return config.enabled === true;
        });
        setAlertConfigs(enabledConfigs);

        // Fetch SSL notification templates
        const templates = await sslNotificationTemplateService.getTemplates();
        setSslTemplates(templates);
      } catch (error) {
        toast.error(t('failedToLoadCertificates'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert the form values to the required DTO format
      const certData: AddSSLCertificateDto = {
        domain: values.domain,
        warning_threshold: values.warning_threshold,
        expiry_threshold: values.expiry_threshold,
        notification_channel: values.notification_channels && values.notification_channels.length > 0
          ? values.notification_channels.join(',')
          : '',
        notification_id: values.notification_channels && values.notification_channels.length > 0
          ? values.notification_channels.join(',')
          : '',
        template_id: values.alert_template && values.alert_template !== 'none' ? values.alert_template : '',
        check_interval: values.check_interval
      };

      await onSubmit(certData);
      form.reset();
    } catch (error) {
      toast.error(t('failedToAddCertificate'));
    }
  };

  const handleAddNotificationChannel = (channelId: string) => {
    const currentChannels = form.getValues("notification_channels") || [];
    if (!currentChannels.includes(channelId)) {
      form.setValue("notification_channels", [...currentChannels, channelId]);
    }
  };

  const handleRemoveNotificationChannel = (channelId: string) => {
    const currentChannels = form.getValues("notification_channels") || [];
    form.setValue("notification_channels", currentChannels.filter(id => id !== channelId));
  };

  const selectedChannels = form.watch("notification_channels") || [];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <FormField
          control={form.control}
          name="check_interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Interval (Days)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="30" {...field} />
              </FormControl>
              <FormDescription>
                How often to check the SSL certificate (in days)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notification_channels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('notificationChannel')} (Multi-select)</FormLabel>
              <div className="space-y-3">
                <Select
                  onValueChange={handleAddNotificationChannel}
                  value=""
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channels to add..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {alertConfigs.length > 0 ? (
                      alertConfigs
                        .filter(config => config.id && !selectedChannels.includes(config.id))
                        .map((config) => (
                          <SelectItem key={config.id} value={config.id || "unknown"}>
                            {config.notify_name} ({config.notification_type})
                          </SelectItem>
                        ))
                    ) : isLoading ? (
                      <SelectItem value="loading-placeholder" disabled>{t('loadingChannels')}</SelectItem>
                    ) : (
                      <SelectItem value="no-channels-placeholder" disabled>{t('noChannelsFound')}</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {/* Display selected channels */}
                {selectedChannels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedChannels.map((channelId) => {
                      const channel = alertConfigs.find(config => config.id === channelId);
                      return (
                        <Badge key={channelId} variant="secondary" className="flex items-center gap-1">
                          {channel ? `${channel.notify_name} (${channel.notification_type})` : channelId}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => handleRemoveNotificationChannel(channelId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              <FormDescription className="flex items-center gap-1">
                <Bell className="h-4 w-4" />
                {t('whereToSend')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alert_template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Template</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an alert template (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {sslTemplates.length > 0 ? (
                    sslTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  ) : isLoading ? (
                    <SelectItem value="loading-templates" disabled>Loading templates...</SelectItem>
                  ) : (
                    <SelectItem value="no-templates-found" disabled>No templates found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Template for SSL certificate alert messages
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