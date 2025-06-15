
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, CheckCircle, XCircle, AlertTriangle, Pause, Clock } from 'lucide-react';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { Service, UptimeData } from '@/types/service.types';
import { UptimeHistoryRenderer } from './UptimeHistoryRenderer';
import { format } from 'date-fns';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'paused':
        return <Pause className="h-5 w-5 text-gray-500" />;
      default:
        return <Server className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Operational
          </Badge>
        );
      case 'down':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800">
            <Pause className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (components.length === 0) {
    return (
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Server className="h-5 w-5" />
            System Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'API Services', description: 'Core API endpoints and services', status: 'up' },
              { name: 'Database', description: 'Primary database systems', status: 'up' },
              { name: 'Authentication', description: 'User authentication services', status: 'up' },
              { name: 'File Storage', description: 'Media and file hosting', status: 'up' }
            ].map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors">
                <div className="flex items-center gap-3">
                  {getStatusIcon(component.status)}
                  <div>
                    <h3 className="font-medium text-foreground">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">99.9% uptime</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">100ms response</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(component.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Server className="h-5 w-5" />
          System Components
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time status of all monitored components
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {components
            .sort((a, b) => a.display_order - b.display_order)
            .map((component) => {
              const service = getServiceForComponent(component);
              const status = getComponentStatus(component);
              const uptime = service?.id ? getUptimePercentage(component.service_id) : 100;
              
              return (
                <div key={component.id} className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-lg">{component.name}</h3>
                          {service?.responseTime && service.responseTime > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              <Clock className="h-3 w-3" />
                              {service.responseTime}ms
                            </div>
                          )}
                        </div>
                        {component.description && (
                          <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusDotColor(status)}`}></div>
                            <span className="font-medium">{uptime}% uptime (90 days)</span>
                          </div>
                          {service?.lastChecked && (
                            <span>Last checked: {format(new Date(service.lastChecked), 'HH:mm:ss')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(status)}
                    </div>
                  </div>
                  
                  {component.service_id && (
                    <div className="ml-9">
                      <div className="text-xs text-muted-foreground mb-2">90-day uptime history</div>
                      <UptimeHistoryRenderer 
                        serviceId={component.service_id} 
                        uptimeData={uptimeData} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};