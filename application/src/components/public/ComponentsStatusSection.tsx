
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { Service, UptimeData } from '@/types/service.types';
import { UptimeHistoryRenderer } from './UptimeHistoryRenderer';

interface ComponentsStatusSectionProps {
  components: StatusPageComponentRecord[];
  services: Service[];
  uptimeData: Record<string, UptimeData[]>;
}

export const ComponentsStatusSection = ({ components, services, uptimeData }: ComponentsStatusSectionProps) => {
  const getServiceForComponent = (component: StatusPageComponentRecord) => {
    return services.find(service => service.id === component.service_id);
  };

  const getComponentStatus = (component: StatusPageComponentRecord) => {
    const service = getServiceForComponent(component);
    return service?.status || 'unknown';
  };

  const getUptimePercentage = (serviceId: string) => {
    const history = uptimeData[serviceId] || [];
    if (history.length === 0) return 100;
    
    const upCount = history.filter(record => record.status === 'up').length;
    return Math.round((upCount / history.length) * 100 * 100) / 100;
  };

  if (components.length === 0) {
    return (
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <h3 className="font-medium text-foreground">Core Services</h3>
                <p className="text-sm text-muted-foreground">All core functionality</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <h3 className="font-medium text-foreground">API Services</h3>
                <p className="text-sm text-muted-foreground">REST and GraphQL APIs</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <h3 className="font-medium text-foreground">Database</h3>
                <p className="text-sm text-muted-foreground">Data storage and retrieval</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {components
            .sort((a, b) => a.display_order - b.display_order)
            .map((component) => {
              const service = getServiceForComponent(component);
              const status = getComponentStatus(component);
              const uptime = service?.id ? getUptimePercentage(component.service_id) : 100;
              
              return (
                <div key={component.id} className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-foreground">{component.name}</h3>
                        {component.description && (
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                        )}
                        {service && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Uptime: {uptime}%</span>
                            {service.responseTime > 0 && (
                              <span className="text-xs text-muted-foreground">
                                Response: {service.responseTime}ms
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        status === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : status === 'down'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : status === 'paused'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {status === 'up' ? 'Operational' : 
                       status === 'down' ? 'Down' :
                       status === 'paused' ? 'Paused' : 'Warning'}
                    </Badge>
                  </div>
                  
                  {/* Individual component uptime history */}
                  {component.service_id && (
                    <UptimeHistoryRenderer 
                      serviceId={component.service_id} 
                      uptimeData={uptimeData} 
                    />
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};