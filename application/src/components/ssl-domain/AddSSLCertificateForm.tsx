
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { AddSSLCertificateDto } from "@/types/ssl.types";

const formSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  port: z.coerce.number().int().min(1).max(65535),
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      port: 443,
      warning_threshold: 30,
      expiry_threshold: 7,
      notification_channel: "default"
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert the form values to the required DTO format with required properties
      const certData: AddSSLCertificateDto = {
        domain: values.domain,
        port: values.port,
        warning_threshold: values.warning_threshold,
        expiry_threshold: values.expiry_threshold,
        notification_channel: values.notification_channel
      };
      
      await onSubmit(certData);
      form.reset();
    } catch (error) {
      console.error("Error adding SSL certificate:", error);
      toast.error("Failed to add SSL certificate");
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
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
              <FormLabel>Warning Threshold (days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Get notified when certificates are about to expire
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
              <FormLabel>Expiry Threshold (days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Get notified when certificates are critically close to expiring
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
              <FormLabel>Notification Channel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification channel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where to receive SSL certificate alerts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            Add Certificate
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};