
import { Badge } from '@/components/ui/badge';
import { OperationalPageRecord } from '@/types/operational.types';

interface StatusBadgeProps {
  status: OperationalPageRecord['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: OperationalPageRecord['status']) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operational',
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        };
      case 'degraded':
        return {
          label: 'Degraded Performance',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'maintenance':
        return {
          label: 'Under Maintenance',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      case 'major_outage':
        return {
          label: 'Major Outage',
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};