
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { maintenanceService } from '@/services/maintenance';
import { useLanguage } from '@/contexts/LanguageContext';
import { authService } from '@/services/authService';

// Define form schema with Zod
export const maintenanceFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  start_time: z.date(),
  end_time: z.date(),
  affected: z.string().min(3, { message: "Affected services must be specified" }),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  field: z.enum(['minor', 'moderate', 'major']),
  assigned_users: z.array(z.string()).default([]),
  notify_subscribers: z.boolean().default(false),
  notification_channel_id: z.string().optional(),
});

// Infer TypeScript type from schema
export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export const useMaintenanceForm = (
  onSuccess: () => void,
  onClose: () => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Get current user
  const currentUser = authService.getCurrentUser();

  // Initialize form with default values
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      start_time: new Date(),
      end_time: new Date(Date.now() + 3600000), // 1 hour from now
      affected: '',
      priority: 'medium',
      status: 'scheduled',
      field: 'minor',
      assigned_users: [],
      notify_subscribers: false,
      notification_channel_id: '',
    },
  });

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      console.log("Form data before submission:", data);
      console.log("Assigned users before submission:", data.assigned_users);
      console.log("Notification channel before submission:", data.notification_channel_id);
      
      // Verify dates are valid
      if (!data.start_time || isNaN(data.start_time.getTime())) {
        throw new Error("Invalid start time");
      }
      
      if (!data.end_time || isNaN(data.end_time.getTime())) {
        throw new Error("Invalid end time");
      }
      
      // Format the submission payload
      const formattedData = {
        title: data.title,
        description: data.description,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        affected: data.affected,
        priority: data.priority,
        status: data.status,
        field: data.field,
        created_by: currentUser?.id || '',
        // Ensure assigned_users is properly formatted as an array
        assigned_users: Array.isArray(data.assigned_users) ? data.assigned_users : [],
        notify_subscribers: data.notify_subscribers ? 'yes' : 'no',
        // Set notification_channel_id correctly - avoid "none" value
        notification_channel_id: data.notify_subscribers && data.notification_channel_id && data.notification_channel_id !== 'none' 
          ? data.notification_channel_id 
          : '',
        // Set notification_id to match notification_channel_id for consistency
        notification_id: data.notify_subscribers && data.notification_channel_id && data.notification_channel_id !== 'none'
          ? data.notification_channel_id
          : '',
      };
      
      console.log("Submitting maintenance with data:", formattedData);
      console.log("Assigned users being sent:", formattedData.assigned_users);
      console.log("Notification channel being sent:", formattedData.notification_channel_id);
      console.log("Notification ID being sent:", formattedData.notification_id);

      // Create the maintenance record
      await maintenanceService.createMaintenance(formattedData);
      
      toast({
        title: t('maintenanceCreated'),
        description: t('maintenanceCreatedDesc'),
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      
      if (error instanceof Error) {
        toast({
          title: t('error'),
          description: `${t('errorCreatingMaintenance')}: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('error'),
          description: t('errorCreatingMaintenance'),
          variant: 'destructive',
        });
      }
    }
  };

  return {
    form,
    onSubmit,
  };
};
