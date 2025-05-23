
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { useMaintenanceEditForm } from '../hooks/useMaintenanceEditForm';
import {
  MaintenanceBasicFields,
  MaintenanceTimeFields,
  MaintenanceAffectedFields,
  MaintenanceConfigFields,
  MaintenanceNotificationSettingsField
} from '../form';

interface EditMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: MaintenanceItem;
  onMaintenanceUpdated: () => void;
}

export const EditMaintenanceDialog = ({ 
  open, 
  onOpenChange,
  maintenance,
  onMaintenanceUpdated
}: EditMaintenanceDialogProps) => {
  const { t } = useLanguage();
  
  const handleSuccess = () => {
    console.log("EditMaintenanceDialog: maintenance updated successfully");
    onMaintenanceUpdated();
  };
  
  const handleClose = () => {
    console.log("EditMaintenanceDialog: closing dialog");
    onOpenChange(false);
  };
  
  const { form, onSubmit } = useMaintenanceEditForm(maintenance, handleSuccess, handleClose);

  // Log the form state for debugging
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values in edit dialog:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editMaintenanceWindow')}</DialogTitle>
          <DialogDescription>
            {t('editMaintenanceDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MaintenanceBasicFields />
            <MaintenanceTimeFields />
            <MaintenanceAffectedFields />
            <MaintenanceConfigFields />
            <MaintenanceNotificationSettingsField />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t('updating') : t('updateMaintenance')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
