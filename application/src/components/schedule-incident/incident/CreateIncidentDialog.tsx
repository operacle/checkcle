
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useIncidentForm } from './hooks/useIncidentForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  IncidentBasicFields,
  IncidentAffectedFields,
  IncidentConfigFields,
  IncidentDetailsFields,
} from './form';

interface CreateIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncidentCreated: () => void;
}

export const CreateIncidentDialog: React.FC<CreateIncidentDialogProps> = ({
  open,
  onOpenChange,
  onIncidentCreated,
}) => {
  const { t } = useLanguage();
  const { form, onSubmit } = useIncidentForm(
    onIncidentCreated,
    () => onOpenChange(false)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <ScrollArea className="h-[80vh]">
          <div className="px-1 py-2">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl">{t('createIncident')}</DialogTitle>
              <DialogDescription>
                {t('createIncidentDesc')}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-8 pb-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">{t('basicInfo')}</h3>
                    <IncidentBasicFields />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">{t('affectedSystems')}</h3>
                    <IncidentAffectedFields />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">{t('configuration')}</h3>
                    <IncidentConfigFields />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">{t('resolutionDetails')}</h3>
                    <IncidentDetailsFields />
                  </div>
                  
                  <DialogFooter className="pt-4 mt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit">
                      {form.formState.isSubmitting ? t('creating') : t('create')}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

