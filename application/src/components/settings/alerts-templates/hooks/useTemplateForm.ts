
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templateService, CreateUpdateTemplateData } from "@/services/templateService";
import { useEffect } from "react";

// Template form schema
export const templateFormSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
  up_message: z.string().min(1, "Up message is required"),
  down_message: z.string().min(1, "Down message is required"),
  maintenance_message: z.string().min(1, "Maintenance message is required"),
  incident_message: z.string().min(1, "Incident message is required"),
  resolved_message: z.string().min(1, "Resolved message is required"),
  service_name_placeholder: z.string().min(1, "Service name placeholder is required"),
  response_time_placeholder: z.string().min(1, "Response time placeholder is required"),
  status_placeholder: z.string().min(1, "Status placeholder is required"),
  threshold_placeholder: z.string().min(1, "Threshold placeholder is required"),
});

// Define the form data type from the schema
export type TemplateFormData = z.infer<typeof templateFormSchema>;

// Default form values
const defaultFormValues: TemplateFormData = {
  name: "",
  type: "default",
  up_message: "Service ${service_name} is UP. Response time: ${response_time}ms",
  down_message: "Service ${service_name} is DOWN. Status: ${status}",
  maintenance_message: "Service ${service_name} is under maintenance",
  incident_message: "Service ${service_name} has an incident",
  resolved_message: "Service ${service_name} issue has been resolved",
  service_name_placeholder: "${service_name}",
  response_time_placeholder: "${response_time}",
  status_placeholder: "${status}",
  threshold_placeholder: "${threshold}",
};

export interface UseTemplateFormProps {
  templateId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const useTemplateForm = ({ templateId, open, onOpenChange, onSuccess }: UseTemplateFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!templateId;

  console.log("Template form initialized with templateId:", templateId, "isEditMode:", isEditMode);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange"
  });

  // Query to fetch template data for editing
  const { isLoading: isLoadingTemplate, data: templateData } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => {
      if (!templateId) return null;
      console.log("Fetching template data for ID:", templateId);
      return templateService.getTemplate(templateId);
    },
    enabled: !!templateId && open,
  });

  // Set form values when template data is loaded
  useEffect(() => {
    if (templateData && open) {
      console.log("Setting form values with template data:", templateData);
      
      form.reset({
        name: templateData.name || "",
        type: templateData.type || "default",
        up_message: templateData.up_message || "",
        down_message: templateData.down_message || "",
        maintenance_message: templateData.maintenance_message || "",
        incident_message: templateData.incident_message || "",
        resolved_message: templateData.resolved_message || "",
        service_name_placeholder: templateData.service_name_placeholder || "${service_name}",
        response_time_placeholder: templateData.response_time_placeholder || "${response_time}",
        status_placeholder: templateData.status_placeholder || "${status}",
        threshold_placeholder: templateData.threshold_placeholder || "${threshold}",
      });
    }
  }, [templateData, open, form]);

  // Handle form errors
  useEffect(() => {
    const subscription = form.formState.errors.root?.message && 
      toast({
        title: "Error",
        description: form.formState.errors.root.message,
        variant: "destructive",
      });
    
    return () => {
      if (subscription) {
        // Clean up if needed
      }
    };
  }, [form.formState.errors.root, toast]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUpdateTemplateData) => templateService.createTemplate(data),
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "Your notification template has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['notification_templates'] });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateUpdateTemplateData }) => 
      templateService.updateTemplate(id, data),
    onSuccess: () => {
      toast({
        title: "Template updated",
        description: "Your notification template has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['notification_templates'] });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating template:", error);
      toast({
        title: "Error",
        description: "Failed to update template. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handle form submission
  const onSubmit = (formData: TemplateFormData) => {
    console.log("Submitting form data:", formData);
    
    // Ensure all required fields are present
    const completeData: CreateUpdateTemplateData = {
      name: formData.name,
      type: formData.type,
      up_message: formData.up_message,
      down_message: formData.down_message,
      maintenance_message: formData.maintenance_message,
      incident_message: formData.incident_message,
      resolved_message: formData.resolved_message,
      service_name_placeholder: formData.service_name_placeholder,
      response_time_placeholder: formData.response_time_placeholder,
      status_placeholder: formData.status_placeholder,
      threshold_placeholder: formData.threshold_placeholder,
    };
    
    if (isEditMode && templateId) {
      console.log("Updating template with ID:", templateId);
      updateMutation.mutate({ id: templateId, data: completeData });
    } else {
      console.log("Creating new template");
      createMutation.mutate(completeData);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      console.log("Dialog closed, resetting form");
      form.reset(defaultFormValues);
    }
  }, [open, form]);

  return {
    form,
    isEditMode,
    isLoadingTemplate,
    isSubmitting,
    onSubmit
  };
};
