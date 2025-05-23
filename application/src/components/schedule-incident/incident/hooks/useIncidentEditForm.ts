
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { incidentService, IncidentItem } from '@/services/incident';
import { useLanguage } from '@/contexts/LanguageContext';
import { incidentFormSchema, IncidentFormValues } from './useIncidentForm';

export const useIncidentEditForm = (
  incident: IncidentItem,
  onSuccess: () => void,
  onClose: () => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Initialize form with existing incident data
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      title: incident.title || '',
      description: incident.description || '',
      affected_systems: incident.affected_systems || '',
      status: (incident.status?.toLowerCase() || incident.impact_status?.toLowerCase() || 'investigating') as any,
      impact: (incident.impact?.toLowerCase() || 'minor') as any,
      priority: (incident.priority?.toLowerCase() || 'medium') as any,
      service_id: incident.service_id || '',
      assigned_to: incident.assigned_to || '',
      root_cause: incident.root_cause || '',
      resolution_steps: incident.resolution_steps || '',
      lessons_learned: incident.lessons_learned || '',
    },
  });

  const onSubmit = async (data: IncidentFormValues) => {
    try {
      console.log("Form data for update:", data);
      console.log("Assigned user ID for update:", data.assigned_to);
      
      await incidentService.updateIncident(incident.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        affected_systems: data.affected_systems,
        impact: data.impact,
        priority: data.priority,
        service_id: data.service_id,
        assigned_to: data.assigned_to, // This is the user ID from the form
        root_cause: data.root_cause,
        resolution_steps: data.resolution_steps,
        lessons_learned: data.lessons_learned,
      });
      
      toast({
        title: t('incidentUpdated'),
        description: t('incidentUpdatedDesc'),
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error updating incident:', error);
      
      if (error instanceof Error) {
        toast({
          title: t('error'),
          description: `${t('errorUpdatingIncident')}: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('error'),
          description: t('errorUpdatingIncident'),
          variant: 'destructive',
        });
      }
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
