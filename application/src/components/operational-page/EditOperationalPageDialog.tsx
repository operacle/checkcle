import { useState, useEffect } from 'react';
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
  const [selectedComponents, setSelectedComponents] = useState<Partial<StatusPageComponentRecord>[]>([]);
  const [existingComponents, setExistingComponents] = useState<StatusPageComponentRecord[]>([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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

  useEffect(() => {
    if (page) {
      form.reset({
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
      });
    }
  }, [page, form]);

  useEffect(() => {
    if (components && components.length > 0) {
      console.log('Loading existing components:', components);
      setExistingComponents(components);
      // Convert existing components to the format expected by ComponentsSelector
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
    } else {
      setExistingComponents([]);
      setSelectedComponents([]);
    }
  }, [components]);

  const handleComponentDelete = async (componentId: string) => {
    try {
      console.log('Deleting component:', componentId);
      await deleteComponentMutation.mutateAsync(componentId);
      
      // Update local state to remove the deleted component
      setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId));
      setExistingComponents(prev => prev.filter(comp => comp.id !== componentId));
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

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
      
      console.log('Updating operational page with payload:', payload);
      await updateMutation.mutateAsync({ id: page.id, data: payload });
      
      // Handle component changes
      const currentComponentIds = existingComponents.map(c => c.id);
      const newComponentsToCreate = selectedComponents.filter(comp => !comp.id);
      const componentsToKeep = selectedComponents.filter(comp => comp.id && currentComponentIds.includes(comp.id));
      const componentsToDelete = existingComponents.filter(comp => !selectedComponents.some(selected => selected.id === comp.id));

      // Delete removed components (only if not already deleted via handleComponentDelete)
      for (const component of componentsToDelete) {
        if (selectedComponents.some(selected => selected.id === component.id)) {
          continue; // Skip if already handled by handleComponentDelete
        }
        console.log('Deleting component during save:', component.id);
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
        
        console.log('Creating component with payload:', componentPayload);
        await createComponentMutation.mutateAsync(componentPayload);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating operational page:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Operational Page</DialogTitle>
          <DialogDescription>
            Update your operational status page settings and manage components.
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Service Status" {...field} />
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
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="my-service-status" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief description of your operational page" 
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
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="degraded">Degraded Performance</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="major_outage">Major Outage</SelectItem>
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
                    <FormLabel>Public Page</FormLabel>
                    <FormDescription>
                      Make this page publicly accessible
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
                  <FormLabel>Custom Domain (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="status.yourdomain.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Custom domain for your status page
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
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isFormSubmitting || updateMutation.isPending || createComponentMutation.isPending}
              >
                {isFormSubmitting || updateMutation.isPending || createComponentMutation.isPending ? 'Updating...' : 'Update Page'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};