
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { serviceSchema, ServiceFormData } from "./add-service/types";
import { ServiceBasicFields } from "./add-service/ServiceBasicFields";
import { ServiceTypeField } from "./add-service/ServiceTypeField";
import { ServiceConfigFields } from "./add-service/ServiceConfigFields";
import { ServiceNotificationFields } from "./add-service/ServiceNotificationFields";
import { ServiceFormActions } from "./add-service/ServiceFormActions";
import { serviceService } from "@/services/serviceService";
import { Service } from "@/types/service.types";

interface ServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Service | null;
  isEdit?: boolean;
  onSubmitStart?: () => void;
}

export function ServiceForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEdit = false,
  onSubmitStart
}: ServiceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      type: "http",
      url: "",
      interval: "60",
      retries: "3",
      notificationChannel: "",
      alertTemplate: "",
    },
    mode: "onBlur",
  });

  // Populate form when initialData changes (separate from initialization)
  useEffect(() => {
    if (initialData && isEdit) {
      // Reset the form with initial data values
      form.reset({
        name: initialData.name || "",
        type: (initialData.type || "http").toLowerCase(),
        url: initialData.url || "",
        interval: String(initialData.interval || 60),
        retries: String(initialData.retries || 3),
        notificationChannel: initialData.notificationChannel || "",
        alertTemplate: initialData.alertTemplate || "",
      });

      // Log for debugging
      console.log("Populating form with URL:", initialData.url);
    }
  }, [initialData, isEdit, form]);

  const handleSubmit = async (data: ServiceFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    if (onSubmitStart) onSubmitStart();
    
    try {
      console.log("Form data being submitted:", data); // Debug log for submitted data
      
      if (isEdit && initialData) {
        // Update existing service
        await serviceService.updateService(initialData.id, {
          name: data.name,
          type: data.type,
          url: data.url,
          interval: parseInt(data.interval),
          retries: parseInt(data.retries),
          notificationChannel: data.notificationChannel === "none" ? "" : data.notificationChannel,
          alertTemplate: data.alertTemplate === "default" ? "" : data.alertTemplate,
        });
        
        toast({
          title: "Service updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new service
        await serviceService.createService({
          name: data.name,
          type: data.type,
          url: data.url,
          interval: parseInt(data.interval),
          retries: parseInt(data.retries),
          notificationChannel: data.notificationChannel === "none" ? undefined : data.notificationChannel,
          alertTemplate: data.alertTemplate === "default" ? undefined : data.alertTemplate,
        });
        
        toast({
          title: "Service created",
          description: `${data.name} has been added to monitoring.`,
        });
      }
      
      onSuccess();
      if (!isEdit) {
        form.reset();
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} service:`, error);
      toast({
        title: `Failed to ${isEdit ? 'update' : 'create'} service`,
        description: `An error occurred while ${isEdit ? 'updating' : 'creating'} the service.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-6">
        <ServiceBasicFields form={form} />
        <ServiceTypeField form={form} />
        <ServiceConfigFields form={form} />
        <ServiceNotificationFields form={form} />
        <ServiceFormActions 
          isSubmitting={isSubmitting} 
          onCancel={onCancel} 
          submitLabel={isEdit ? "Update Service" : "Create Service"}
        />
      </form>
    </Form>
  );
}
