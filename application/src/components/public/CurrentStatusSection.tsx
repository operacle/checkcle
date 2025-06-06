
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { OperationalPageRecord } from '@/types/operational.types';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { Service } from '@/types/service.types';

interface CurrentStatusSectionProps {
  page: OperationalPageRecord;
  components: StatusPageComponentRecord[];
  services: Service[];
}

const getActualStatus = (components: StatusPageComponentRecord[], services: Service[]) => {
  if (components.length === 0) {
    return 'operational'; // Default if no components
  }

  let hasDown = false;
  let hasDegraded = false;
  let hasMaintenance = false;

  components.forEach(component => {
    const service = services.find(s => s.id === component.service_id);
    if (service) {
      switch (service.status) {
        case 'down':
          hasDown = true;
          break;
        case 'warning':
          hasDegraded = true;
          break;
        case 'paused':
          hasMaintenance = true;
          break;
      }
    }
  });

  // Priority: down > degraded > maintenance > operational
  if (hasDown) return 'major_outage';
  if (hasDegraded) return 'degraded';
  if (hasMaintenance) return 'maintenance';
  return 'operational';
};

const getStatusMessage = (status: OperationalPageRecord['status']) => {
  switch (status) {
    case 'operational':
      return 'All systems are operational';
    case 'degraded':
      return 'Some systems are experiencing degraded performance';
    case 'maintenance':
      return 'Systems are currently under maintenance';
    case 'major_outage':
      return 'We are experiencing a major service outage';
    default:
      return 'Status unknown';
  }
};

const getStatusColor = (status: OperationalPageRecord['status']) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 dark:text-green-400';
    case 'degraded':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'maintenance':
      return 'text-blue-600 dark:text-blue-400';
    case 'major_outage':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-muted-foreground';
  }
};

export const CurrentStatusSection = ({ page, components, services }: CurrentStatusSectionProps) => {
  const actualStatus = getActualStatus(components, services);
  
  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Shield className="h-5 w-5" />
          Current Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-3 w-3 rounded-full ${
            actualStatus === 'operational' ? 'bg-green-500' :
            actualStatus === 'degraded' ? 'bg-yellow-500' :
            actualStatus === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-lg font-medium ${getStatusColor(actualStatus)}`}>
            {getStatusMessage(actualStatus)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated {format(new Date(page.updated), 'MMM dd, yyyy HH:mm')} UTC</span>
        </div>
      </CardContent>
    </Card>
  );
};