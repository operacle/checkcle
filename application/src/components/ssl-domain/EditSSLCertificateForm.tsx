
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SSLCertificate } from "@/types/ssl.types";
import { Loader2, Bell } from "lucide-react";
import { toast } from "sonner";
import { alertConfigService, AlertConfiguration } from "@/services/alertConfigService";

const formSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  warning_threshold: z.coerce.number().min(1, "Warning threshold must be at least 1 day"),
  expiry_threshold: z.coerce.number().min(1, "Expiry threshold must be at least 1 day"),
  notification_channel: z.string().min(1, "Notification channel is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSSLCertificateFormProps {
  certificate: SSLCertificate;
  onSubmit: (data: SSLCertificate) => void;
  onCancel: () => void;
  isPending: boolean;
}

export const EditSSLCertificateForm = ({ certificate, onSubmit, onCancel, isPending }: EditSSLCertificateFormProps) => {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: certificate.domain,
      warning_threshold: certificate.warning_threshold,
      expiry_threshold: certificate.expiry_threshold,
      notification_channel: certificate.notification_channel,
    },
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
      } catch (error) {
        console.error("Error fetching notification channels:", error);
        toast.error("Failed to load notification channels");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificationChannels();
  }, []);

  const handleSubmit = (data: FormValues) => {
    // Merge the updated values with the original certificate
    const updatedCertificate: SSLCertificate = {
      ...certificate,
      ...data,
      // Ensure values are correctly typed as numbers
      warning_threshold: Number(data.warning_threshold),
      expiry_threshold: Number(data.expiry_threshold)
    };
    
    console.log("Submitting updated certificate:", updatedCertificate);
    onSubmit(updatedCertificate);
  };

  // For debugging
  console.log("Certificate data:", certificate);
  console.log("Form default values:", form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="example.com" 
                  disabled={true} // Domain shouldn't be editable
                />
              </FormControl>
              <FormDescription>
                Domain name cannot be changed. To monitor a different domain, add a new certificate.
              </FormDescription>
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
                <FormLabel>Warning Threshold (Days)</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number"
                    min="1"
                    placeholder="30" 
                  />
                </FormControl>
                <FormDescription>
                  Days before expiration to send warning
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
                <FormLabel>Expiry Threshold (Days)</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number"
                    min="1"
                    placeholder="7" 
                  />
                </FormControl>
                <FormDescription>
                  Days before expiration to send critical alert
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notification_channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Channel</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification channel" />
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
                    <SelectItem value="loading" disabled>Loading channels...</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> 
                Where to send notifications about this certificate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};