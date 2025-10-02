import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateOperationalPage } from '@/hooks/useOperationalPage';
import { useCreateStatusPageComponent } from '@/hooks/useStatusPageComponents';
import { ComponentsSelector } from './ComponentsSelector';
import { Plus } from 'lucide-react';
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

export const CreateOperationalPageDialog = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<Partial<StatusPageComponentRecord>[]>([]);
  const createMutation = useCreateOperationalPage();
  const createComponentMutation = useCreateStatusPageComponent();

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

  const onSubmit = async (data: FormData) => {
    try {
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
      
     // console.log('Creating operational page with payload:', payload);
      const createdPage = await createMutation.mutateAsync(payload);
     // console.log('Created page:', createdPage);
      
      // Create components after page is created
      if (selectedComponents.length > 0) {
      //  console.log('Creating components for page:', createdPage.id);
        for (const component of selectedComponents) {
          const componentPayload = {
            operational_status_id: createdPage.id,
            name: component.name || '',
            description: component.description || '',
            service_id: component.service_id || '',
            server_id: component.server_id || '',
            display_order: component.display_order || 1,
          };
          
        //  console.log('Creating component with payload:', componentPayload);
          await createComponentMutation.mutateAsync(componentPayload);
        }
      }
      
      setOpen(false);
      form.reset();
      setSelectedComponents([]);
    } catch (error) {
     // console.error('Error creating operational page:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('createPage')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('createOperationalPage')}</DialogTitle>
          <DialogDescription>
            {t('createOperationalPageDesc')}
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
                    <FormLabel>{t('initialStatus')}</FormLabel>
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
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || createComponentMutation.isPending}
              >
                {createMutation.isPending || createComponentMutation.isPending ? t('creating') : t('createPage')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};