
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Server } from 'lucide-react';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/serviceService';
import { useLanguage } from "@/contexts/LanguageContext";

interface ComponentsSelectorProps {
  selectedComponents: Partial<StatusPageComponentRecord>[];
  onComponentsChange: (components: Partial<StatusPageComponentRecord>[]) => void;
  onComponentDelete?: (componentId: string) => void;
}

export const ComponentsSelector = ({ selectedComponents, onComponentsChange, onComponentDelete }: ComponentsSelectorProps) => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    service_id: '',
    server_id: '',
    display_order: selectedComponents.length + 1,
  });

  // Fetch uptime services for the dropdown
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
  });

  const addComponent = () => {
    if (!newComponent.name.trim()) return;

    const component: Partial<StatusPageComponentRecord> = {
      ...newComponent,
      operational_status_id: '', // Will be set when page is created
    };

    onComponentsChange([...selectedComponents, component]);
    setNewComponent({
      name: '',
      description: '',
      service_id: '',
      server_id: '',
      display_order: selectedComponents.length + 2,
    });
    setShowAddForm(false);
  };

  const removeComponent = async (index: number) => {
    const component = selectedComponents[index];
    
    // If component has an ID, it exists in database and needs to be deleted
    if (component.id && onComponentDelete) {
      await onComponentDelete(component.id);
    } else {
      // For new components not yet saved, just remove from local state
      const updated = selectedComponents.filter((_, i) => i !== index);
      onComponentsChange(updated);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          {t('statusPageComponents')}
        </CardTitle>
        <CardDescription>
          {t('addMonitoringComponentsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedComponents.length > 0 && (
          <div className="space-y-2">
            <Label>{t('selectedComponents')}</Label>
            <div className="space-y-2">
              {selectedComponents.map((component, index) => (
                <div key={component.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{component.name}</div>
                    {component.description && (
                      <div className="text-sm text-muted-foreground">{component.description}</div>
                    )}
                    <div className="flex gap-2 mt-1">
                      {component.service_id && (
                        <Badge variant="secondary" className="text-xs">
                          {t('service')}: {services.find(s => s.id === component.service_id)?.name || component.service_id}
                        </Badge>
                      )}
                      {component.server_id && (
                        <Badge variant="secondary" className="text-xs">
                          {t('server')}: {component.server_id}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showAddForm ? (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addComponent')}
          </Button>
        ) : (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="component-name">{t('componentName')}</Label>
                <Input
                  id="component-name"
                  placeholder={t('componentNamePlaceholder')}
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="display-order">{t('displayOrder')}</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={newComponent.display_order}
                  onChange={(e) => setNewComponent({ ...newComponent, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="component-description">{t('descriptionOptional')}</Label>
              <Textarea
                id="component-description"
                placeholder={t('descriptionPlaceholder')}
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-id">{t('uptimeServiceOptional')}</Label>
                <Select onValueChange={(value) => setNewComponent({ ...newComponent, service_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectUptimeService')} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            service.status === 'up' ? 'bg-green-500' : 
                            service.status === 'down' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }`} />
                          {service.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="server-id">{t('serverIdOptional')}</Label>
                <Input
                  id="server-id"
                  placeholder={t('serverIdPlaceholder')}
                  value={newComponent.server_id}
                  onChange={(e) => setNewComponent({ ...newComponent, server_id: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addComponent} disabled={!newComponent.name.trim()}>
                {t('addComponent')}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};