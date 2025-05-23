
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
import { useMaintenanceForm } from './hooks/useMaintenanceForm';
import {
  MaintenanceBasicFields,
  MaintenanceTimeFields,
  MaintenanceAffectedFields,
  MaintenanceConfigFields,
  MaintenanceNotificationSettingsField
} from './form';

interface CreateMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaintenanceCreated: () => void;
}

export const CreateMaintenanceDialog = ({ 
  open, 
  onOpenChange,
  onMaintenanceCreated 
}: CreateMaintenanceDialogProps) => {
  const { t } = useLanguage();
  
  const handleSuccess = () => {
    console.log("CreateMaintenanceDialog: maintenance created successfully");
    onMaintenanceCreated();
  };
  
  const handleClose = () => {
    console.log("CreateMaintenanceDialog: closing dialog");
    onOpenChange(false);
  };
  
  const { form, onSubmit } = useMaintenanceForm(handleSuccess, handleClose);

  // Log the form state for debugging
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('createMaintenanceWindow')}</DialogTitle>
          <DialogDescription>
            {t('createMaintenanceDesc')}
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
                {form.formState.isSubmitting ? t('creating') : t('createMaintenance')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
