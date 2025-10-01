import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateOperationalPage } from '@/hooks/useOperationalPage';
import { useCreateStatusPageComponent, useStatusPageComponentsByOperationalId, useDeleteStatusPageComponent } from '@/hooks/useStatusPageComponents';
import { ComponentsSelector } from './ComponentsSelector';
import { OperationalPageRecord } from '@/types/operational.types';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  theme: z.string().min(1, 'Theme is required'),
  status: z.enum(['operational', 'degraded', 'maintenance', 'major_outage']),
  is_public: z.boolean(),
  logo_url: z.string().optional(),
  custom_domain: z.string().optional(),
  custom_css: z.string().optional(),
  page_style: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditOperationalPageDialogProps {
  page: OperationalPageRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditOperationalPageDialog = ({ page, open, onOpenChange }: EditOperationalPageDialogProps) => {
  const { t } = useLanguage();
  const [selectedComponents, setSelectedComponents] = useState<Partial<StatusPageComponentRecord>[]>([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  
  const updateMutation = useUpdateOperationalPage();
  const createComponentMutation = useCreateStatusPageComponent();
  const deleteComponentMutation = useDeleteStatusPageComponent();
  
  // Fetch existing components for this operational page
  const { data: components = [] } = useStatusPageComponentsByOperationalId(page?.id || '');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      theme: 'default',
      status: 'operational',
      is_public: true,
      logo_url: '',
      custom_domain: '',
      custom_css: '',
      page_style: '',
    },
  });

  // Memoize the form reset values to prevent unnecessary re-renders
  const formValues = useMemo(() => {
    if (!page) return null;
    return {
      title: page.title,
      description: page.description,
      slug: page.slug,
      theme: page.theme,
      status: page.status,
      is_public: page.is_public === 'true',
      logo_url: page.logo_url || '',
      custom_domain: page.custom_domain || '',
      custom_css: page.custom_css || '',
      page_style: page.page_style || '',
    };
  }, [page?.id, page?.title, page?.description, page?.slug, page?.theme, page?.status, page?.is_public, page?.logo_url, page?.custom_domain, page?.custom_css, page?.page_style]);

  // Reset form when page data changes
  useEffect(() => {
    if (formValues) {
      form.reset(formValues);
    }
  }, [formValues, form]);

  // Convert components to selector format and initialize state - only when dialog opens and components change
  useEffect(() => {
    if (!open || !page?.id || !components) {
      return;
    }

    // Only update if components actually changed or haven't been loaded yet
    const componentIds = components.map(c => c.id).sort().join(',');
    const currentSelectedIds = selectedComponents.map(c => c.id).filter(Boolean).sort().join(',');
    
    if (componentIds !== currentSelectedIds || !componentsLoaded) {
 //     console.log('Loading existing components:', components);
      const existingComponentsForSelector = components.map(comp => ({
        id: comp.id,
        name: comp.name,
        description: comp.description,
        service_id: comp.service_id,
        server_id: comp.server_id,
        display_order: comp.display_order,
        operational_status_id: comp.operational_status_id,
      }));
      
      setSelectedComponents(existingComponentsForSelector);
      setComponentsLoaded(true);
    }
  }, [open, page?.id, components, componentsLoaded, selectedComponents]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setComponentsLoaded(false);
      setSelectedComponents([]);
    }
  }, [open]);

  const handleComponentDelete = useCallback(async (componentId: string) => {
    try {
   //   console.log('Deleting component:', componentId);
      await deleteComponentMutation.mutateAsync(componentId);
      
      // Update local state to remove the deleted component
      setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId));
    } catch (error) {
   //   console.error('Error deleting component:', error);
    }
  }, [deleteComponentMutation]);

  const onSubmit = async (data: FormData) => {
    if (!page) return;

    try {
      setIsFormSubmitting(true);
      
      const payload = {
        title: data.title,
        description: data.description,
        slug: data.slug,
        theme: data.theme,
        status: data.status,
        is_public: data.is_public ? 'true' : 'false',
        logo_url: data.logo_url || '',
        custom_domain: data.custom_domain || '',
        custom_css: data.custom_css || '',
        page_style: data.page_style || '',
      };
      
   //   console.log('Updating operational page with payload:', payload);
      await updateMutation.mutateAsync({ id: page.id, data: payload });
      
      // Handle component changes
      const currentComponentIds = components.map(c => c.id);
      const newComponentsToCreate = selectedComponents.filter(comp => !comp.id);
      const componentsToDelete = components.filter(comp => !selectedComponents.some(selected => selected.id === comp.id));

      // Delete removed components
      for (const component of componentsToDelete) {
    //    console.log('Deleting component during save:', component.id);
        await deleteComponentMutation.mutateAsync(component.id);
      }

      // Create new components
      for (const component of newComponentsToCreate) {
        const componentPayload = {
          operational_status_id: page.id,
          name: component.name || '',
          description: component.description || '',
          service_id: component.service_id || '',
          server_id: component.server_id || '',
          display_order: component.display_order || 1,
        };
        
    //    console.log('Creating component with payload:', componentPayload);
        await createComponentMutation.mutateAsync(componentPayload);
      }
      
      onOpenChange(false);
    } catch (error) {
    //  console.error('Error updating operational page:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editOperationalPage')}</DialogTitle>
          <DialogDescription>
            {t('updateYourOperationalPage')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('myServiceStatusPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('slug')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('myServiceStatusSlugPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('operationalPageDescriptionPlaceholder')} 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('theme')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectTheme')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">{t('themeDefault')}</SelectItem>
                        <SelectItem value="dark">{t('themeDark')}</SelectItem>
                        <SelectItem value="light">{t('themeLight')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">{t('statusOperational')}</SelectItem>
                        <SelectItem value="degraded">{t('statusDegraded')}</SelectItem>
                        <SelectItem value="maintenance">{t('statusMaintenance')}</SelectItem>
                        <SelectItem value="major_outage">{t('statusMajorOutage')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t('publicPage')}</FormLabel>
                    <FormDescription>
                      {t('makePagePublic')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom_domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customDomainOptional')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('customDomainPlaceholder')} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('customDomainDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ComponentsSelector
              selectedComponents={selectedComponents}
              onComponentsChange={setSelectedComponents}
              onComponentDelete={handleComponentDelete}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isFormSubmitting || updateMutation.isPending || createComponentMutation.isPending}
              >
                {isFormSubmitting || updateMutation.isPending || createComponentMutation.isPending ? t('updating') : t('updatePage')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};