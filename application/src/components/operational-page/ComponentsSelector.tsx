import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Server, Shield, AlertTriangle } from 'lucide-react';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/serviceService';

interface ComponentsSelectorProps {
  selectedComponents: Partial<StatusPageComponentRecord>[];
  onComponentsChange: (components: Partial<StatusPageComponentRecord>[]) => void;
  onComponentDelete?: (componentId: string) => void;
}

const componentTypes = [
  { value: 'uptime', label: 'Uptime Service', icon: Server },
  { value: 'ssl', label: 'SSL Certificate', icon: Shield },
  { value: 'incident', label: 'Incident Monitoring', icon: AlertTriangle },
];

export const ComponentsSelector = ({ selectedComponents, onComponentsChange, onComponentDelete }: ComponentsSelectorProps) => {
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
          Status Page Components
        </CardTitle>
        <CardDescription>
          Add monitoring components like uptime services, SSL certificates, and incident tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedComponents.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Components</Label>
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
                          Service: {services.find(s => s.id === component.service_id)?.name || component.service_id}
                        </Badge>
                      )}
                      {component.server_id && (
                        <Badge variant="secondary" className="text-xs">
                          Server: {component.server_id}
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
            Add Component
          </Button>
        ) : (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="component-name">Component Name</Label>
                <Input
                  id="component-name"
                  placeholder="e.g., Main Website"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={newComponent.display_order}
                  onChange={(e) => setNewComponent({ ...newComponent, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="component-description">Description (Optional)</Label>
              <Textarea
                id="component-description"
                placeholder="Brief description of this component"
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-id">Uptime Service (Optional)</Label>
                <Select onValueChange={(value) => setNewComponent({ ...newComponent, service_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an uptime service" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border shadow-lg">
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
                <Label htmlFor="server-id">Server ID (Optional)</Label>
                <Input
                  id="server-id"
                  placeholder="server_456"
                  value={newComponent.server_id}
                  onChange={(e) => setNewComponent({ ...newComponent, server_id: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addComponent} disabled={!newComponent.name.trim()}>
                Add Component
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <Label>Quick Add Templates</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            {componentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const component: Partial<StatusPageComponentRecord> = {
                      name: type.label,
                      description: `Monitor ${type.label.toLowerCase()}`,
                      service_id: '',
                      server_id: '',
                      display_order: selectedComponents.length + 1,
                      operational_status_id: '',
                    };
                    onComponentsChange([...selectedComponents, component]);
                  }}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};