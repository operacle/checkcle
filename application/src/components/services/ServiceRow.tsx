
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Service } from "@/types/service.types";
import { StatusBadge } from "./StatusBadge";
import { UptimeBar } from "./UptimeBar";
import { LastCheckedTime } from "./LastCheckedTime";
import { 
  ServiceRowActions, 
  ServiceRowHeader, 
  ServiceRowResponseTime 
} from "./service-row";
import { useTheme } from "@/contexts/ThemeContext";

interface ServiceRowProps {
  service: Service;
  onViewDetail: (service: Service) => void;
  onPauseResume: (service: Service) => Promise<void>;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onMuteAlerts?: (service: Service) => Promise<void>;
}

export const ServiceRow = ({ 
  service, 
  onViewDetail,
  onPauseResume,
  onEdit, 
  onDelete,
  onMuteAlerts
}: ServiceRowProps) => {
  const { theme } = useTheme();
  const handleRowClick = () => {
    onViewDetail(service);
  };

  // Get the timestamp to display - use only lastChecked since that's what's defined in the Service type
  const displayTimestamp = service.lastChecked || new Date().toLocaleString();

  return (
    <TableRow 
      key={service.id} 
      className={`border-b ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-900/60' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer`}
      onClick={handleRowClick}
    >
      <TableCell className="font-medium py-4">
        <ServiceRowHeader service={service} />
      </TableCell>
      <TableCell className={`text-base py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {service.type}
      </TableCell>
      <TableCell className="py-4">
        <StatusBadge status={service.status} size="md" />
      </TableCell>
      <TableCell className="py-4">
        <ServiceRowResponseTime responseTime={service.responseTime} />
      </TableCell>
      <TableCell className="w-52 py-4">
        <UptimeBar 
          uptime={service.uptime} 
          status={service.status} 
          serviceId={service.id} 
          interval={service.interval}
        />
      </TableCell>
      <TableCell className="py-4">
        <LastCheckedTime 
          lastCheckedTime={displayTimestamp} 
          status={service.status} 
          interval={service.interval} 
        />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()} className="py-4">
        <ServiceRowActions 
          service={service} 
          onViewDetail={onViewDetail}
          onPauseResume={onPauseResume}
          onEdit={onEdit}
          onDelete={onDelete}
          onMuteAlerts={onMuteAlerts}
        />
      </TableCell>
    </TableRow>
  );
};