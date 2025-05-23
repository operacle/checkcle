
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { maintenanceService, MaintenanceItem } from '@/services/maintenance';
import { useLanguage } from '@/contexts/LanguageContext';
import { maintenanceFormSchema, MaintenanceFormValues } from './useMaintenanceForm';

export const useMaintenanceEditForm = (
  maintenance: MaintenanceItem,
  onSuccess: () => void,
  onClose: () => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Parse assigned_users to ensure it's an array
  const getAssignedUsers = (): string[] => {
    console.log("Original assigned_users:", maintenance.assigned_users);
    
    if (!maintenance.assigned_users) {
      console.log("No assigned users, returning empty array");
      return [];
    }
    
    if (Array.isArray(maintenance.assigned_users)) {
      console.log("Assigned users is already an array:", maintenance.assigned_users);
      return maintenance.assigned_users;
    }
    
    if (typeof maintenance.assigned_users === 'string') {
      // Try to parse as JSON first (for array stored as string)
      try {
        const parsedData = JSON.parse(maintenance.assigned_users);
        if (Array.isArray(parsedData)) {
          console.log("Parsed assigned_users from JSON string:", parsedData);
          return parsedData;
        } else if (typeof parsedData === 'string') {
          // Handle nested JSON strings
          try {
            const nestedData = JSON.parse(parsedData);
            if (Array.isArray(nestedData)) {
              console.log("Parsed assigned_users from nested JSON string:", nestedData);
              return nestedData;
            }
          } catch (e) {
            // Not a nested JSON string, continue
          }
          
          // Single ID in a JSON string
          console.log("Using parsed string as single ID:", [parsedData]);
          return [parsedData];
        } else {
          // Some other type, convert to string and use as single ID
          return [String(parsedData)];
        }
      } catch (e) {
        // Not JSON, try comma splitting
        if (maintenance.assigned_users.includes(',')) {
          const userArray = maintenance.assigned_users.split(',').map(id => id.trim()).filter(Boolean);
          console.log("Converted comma-separated string to array:", userArray);
          return userArray;
        } else {
          // Single ID as string
          console.log("Using string as single ID:", [maintenance.assigned_users]);
          return [maintenance.assigned_users];
        }
      }
    }
    
    console.warn("Unable to parse assigned_users, returning empty array");
    return [];
  };

  // Clean up user IDs by removing quotes, brackets, etc.
  const cleanUserIds = (userIds: string[]): string[] => {
    return userIds.map(id => {
      // Remove surrounding quotes if present
      let cleanId = id.replace(/^["']|["']$/g, '');
      // Remove any remaining JSON artifacts
      cleanId = cleanId.replace(/[\[\]"'\\]/g, '');
      return cleanId;
    }).filter(Boolean);
  };

  // Get notification channel ID (from either notification_channel_id or notification_id)
  const getNotificationChannelId = (): string => {
    console.log("Getting notification channel ID from:", {
      notification_channel_id: maintenance.notification_channel_id,
      notification_id: maintenance.notification_id,
      notify_subscribers: maintenance.notify_subscribers
    });
    
    // Try notification_channel_id first
    if (maintenance.notification_channel_id) {
      console.log("Using notification_channel_id:", maintenance.notification_channel_id);
      return maintenance.notification_channel_id;
    } 
    // Fall back to notification_id if notifications are enabled
    else if (maintenance.notification_id && maintenance.notify_subscribers === 'yes') {
      console.log("Using notification_id:", maintenance.notification_id);
      return maintenance.notification_id;
    }
    
    console.log("No notification channel ID found");
    return '';
  };

  // Initialize form with existing maintenance data
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: maintenance.title || '',
      description: maintenance.description || '',
      start_time: maintenance.start_time ? new Date(maintenance.start_time) : new Date(),
      end_time: maintenance.end_time ? new Date(maintenance.end_time) : new Date(),
      affected: maintenance.affected || '',
      priority: (maintenance.priority?.toLowerCase() || 'medium') as any,
      status: (maintenance.status?.toLowerCase() || 'scheduled') as any,
      field: (maintenance.field?.toLowerCase() || 'minor') as any,
      assigned_users: cleanUserIds(getAssignedUsers()),
      notify_subscribers: maintenance.notify_subscribers === 'yes',
      notification_channel_id: getNotificationChannelId(),
    },
  });

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      console.log("Form data before submission:", data);
      console.log("Assigned users to be submitted:", data.assigned_users);
      console.log("Notification channel to be submitted:", data.notification_channel_id);
      
      // Verify dates are valid
      if (!data.start_time || isNaN(data.start_time.getTime())) {
        throw new Error("Invalid start time");
      }
      
      if (!data.end_time || isNaN(data.end_time.getTime())) {
        throw new Error("Invalid end time");
      }
      
      // Format the update payload
      const updateData = {
        title: data.title,
        description: data.description,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        affected: data.affected,
        priority: data.priority,
        status: data.status,
        field: data.field,
        assigned_users: data.assigned_users || [], // Send as array
        notify_subscribers: data.notify_subscribers ? 'yes' : 'no',
        notification_channel_id: data.notify_subscribers && data.notification_channel_id && data.notification_channel_id !== 'none' 
          ? data.notification_channel_id 
          : '',
        // Set notification_id to match notification_channel_id when notifications are enabled
        notification_id: data.notify_subscribers && data.notification_channel_id && data.notification_channel_id !== 'none'
          ? data.notification_channel_id
          : '',
      };
      
      console.log("Updating maintenance with data:", updateData);
      console.log("Assigned users being sent for update:", updateData.assigned_users);
      console.log("Notification channel being sent for update:", updateData.notification_channel_id);
      console.log("Notification ID being sent for update:", updateData.notification_id);

      // Update the maintenance record using our service function
      await maintenanceService.updateMaintenance(maintenance.id, updateData);
      
      toast({
        title: t('maintenanceUpdated'),
        description: t('maintenanceUpdatedDesc'),
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error updating maintenance:', error);
      
      if (error instanceof Error) {
        toast({
          title: t('error'),
          description: `${t('errorUpdatingMaintenance')}: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('error'),
          description: t('errorUpdatingMaintenance'),
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
