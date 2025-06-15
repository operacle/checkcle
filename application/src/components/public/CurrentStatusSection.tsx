
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';
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

const getStatusIcon = (status: OperationalPageRecord['status']) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'degraded':
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case 'maintenance':
      return <Wrench className="h-6 w-6 text-blue-500" />;
    case 'major_outage':
      return <XCircle className="h-6 w-6 text-red-500" />;
    default:
      return <Shield className="h-6 w-6 text-muted-foreground" />;
  }
};

const getStatusBackground = (status: OperationalPageRecord['status']) => {
  switch (status) {
    case 'operational':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'degraded':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'maintenance':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'major_outage':
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    default:
      return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
  }
};

export const CurrentStatusSection = ({ page, components, services }: CurrentStatusSectionProps) => {
  const actualStatus = getActualStatus(components, services);
  const displayStatus = actualStatus; // Use actual status for real-time accuracy
  
  return (
    <Card className={`mb-8 border-2 ${getStatusBackground(displayStatus)}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-card-foreground text-xl">
          <Shield className="h-6 w-6" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`flex items-center justify-between p-6 rounded-lg border-2 ${getStatusBackground(displayStatus)}`}>
          <div className="flex items-center gap-4">
            {getStatusIcon(displayStatus)}
            <div>
              <h3 className={`text-2xl font-bold ${getStatusColor(displayStatus)}`}>
                {getStatusMessage(displayStatus)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Status automatically updated based on component health
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            displayStatus === 'operational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            displayStatus === 'degraded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            displayStatus === 'maintenance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {displayStatus === 'operational' ? 'All Systems Operational' :
             displayStatus === 'degraded' ? 'Degraded Performance' :
             displayStatus === 'maintenance' ? 'Under Maintenance' : 'Major Outage'}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')} UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live status monitoring</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};