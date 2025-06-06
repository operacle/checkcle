
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";
import { useQuery } from "@tanstack/react-query";
import { templateService } from "@/services/templateService";
import { alertConfigService, AlertConfiguration } from "@/services/alertConfigService";
import { useState, useEffect } from "react";

interface ServiceNotificationFieldsProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceNotificationFields({ form }: ServiceNotificationFieldsProps) {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  
  // Get the current form values for debugging
  const notificationChannel = form.watch("notificationChannel");
  const alertTemplate = form.watch("alertTemplate");
  
  console.log("Current notification values:", { 
    notificationChannel, 
    alertTemplate 
  });
  
  // Fetch alert configurations for notification channels
  const { data: alertConfigsData } = useQuery({
    queryKey: ['alertConfigs'],
    queryFn: () => alertConfigService.getAlertConfigurations(),
  });
  
  // Fetch templates for template selection
  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateService.getTemplates(),
  });
  
  // Update alert configs when data is loaded
  useEffect(() => {
    if (alertConfigsData) {
      // Only show enabled channels
      const enabledChannels = alertConfigsData.filter(config => config.enabled);
      setAlertConfigs(enabledChannels);
      
      // Debug log to check what alert configs are loaded
      console.log("Loaded alert configurations:", enabledChannels);
    }
  }, [alertConfigsData]);

  // Log when form values change to debug
  useEffect(() => {
    console.log("Notification values changed:", {
      notificationChannel: form.getValues("notificationChannel"),
      alertTemplate: form.getValues("alertTemplate")
    });
  }, [form.watch("notificationChannel"), form.watch("alertTemplate")]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="notificationChannel"
        render={({ field }) => {
          // Important: We need to preserve the actual value for notification channel
          const fieldValue = field.value || "";
          const displayValue = fieldValue === "" ? "none" : fieldValue;
          
          console.log("Rendering notification channel field with value:", {
            fieldValue,
            displayValue
          });
          
          return (
            <FormItem>
              <FormLabel>Notification Channel</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={(value) => {
                    console.log("Notification channel changed to:", value);
                    field.onChange(value === "none" ? "" : value);
                  }} 
                  value={displayValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a notification channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {alertConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id || ""}>
                        {config.notify_name} ({config.notification_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          );
        }}
      />
            
      <FormField
        control={form.control}
        name="alertTemplate"
        render={({ field }) => {
          // Don't convert existing values to "default"
          const displayValue = field.value || "default";
          console.log("Rendering alert template field with value:", displayValue);
          
          return (
            <FormItem>
              <FormLabel>Alert Template</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={(value) => {
                    console.log("Alert template changed to:", value);
                    field.onChange(value === "default" ? "" : value);
                  }} 
                  value={displayValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an alert template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          );
        }}
      />
    </>
  );
}