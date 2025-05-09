
import { useQuery } from "@tanstack/react-query";
import { UptimeData } from "@/types/service.types"; 
import { uptimeService } from "@/services/uptimeService";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, X, AlertTriangle, Pause } from "lucide-react";

interface ServiceUptimeHistoryProps {
  serviceId: string;
  startDate?: Date;
  endDate?: Date;
}

export function ServiceUptimeHistory({ 
  serviceId, 
  startDate = new Date(Date.now() - 24 * 60 * 60 * 1000), 
  endDate = new Date() 
}: ServiceUptimeHistoryProps) {
  const { theme } = useTheme();
  const { data: uptimeHistory, isLoading, error } = useQuery({
    queryKey: ['uptimeHistory', serviceId, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => uptimeService.getUptimeHistory(serviceId, 200, startDate, endDate),
    enabled: !!serviceId,
    refetchInterval: 5000, // Refresh UI every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <p>Loading uptime history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p>Error loading uptime history.</p>
      </div>
    );
  }

  if (!uptimeHistory || uptimeHistory.length === 0) {
    return (
      <div className="py-4 text-center">
        <p>No uptime history available for the selected time period.</p>
      </div>
    );
  }

  // Function to get appropriate status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'up':
        return {
          variant: 'default' as const, 
          className: 'bg-emerald-800 text-white hover:bg-emerald-700',
          icon: <Check className="h-3 w-3 mr-1" />
        };
      case 'warning':
        return {
          variant: 'outline' as const,
          className: 'bg-yellow-800/80 text-yellow-300 border-yellow-700 hover:bg-yellow-800',
          icon: <AlertTriangle className="h-3 w-3 mr-1" />
        };
      case 'paused':
        return {
          variant: 'outline' as const,
          className: 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800',
          icon: <Pause className="h-3 w-3 mr-1" />
        };
      default:
        return {
          variant: 'destructive' as const,
          className: '',
          icon: <X className="h-3 w-3 mr-1" />
        };
    }
  };

  return (
    <div className="mt-4 bg-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-muted-foreground font-medium">Time</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Response Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uptimeHistory.map((record) => {
            const statusBadge = getStatusBadge(record.status);
            const isResponseTimeHigh = record.responseTime >= 1000;
            
            return (
              <TableRow key={record.id} className="border-b border-border">
                <TableCell>
                  {format(parseISO(record.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={statusBadge.variant}
                    className={statusBadge.className}
                  >
                    <span className="flex items-center">
                      {statusBadge.icon}
                      {record.status === 'up' ? 'Up' : 
                       record.status === 'down' ? 'Down' : 
                       record.status === 'warning' ? 'Warning' : 'Paused'}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-mono flex items-center gap-1.5">
                    {record.responseTime > 0 ? (
                      <>
                        <span className={isResponseTimeHigh ? "text-amber-500 font-semibold" : ""}>
                          {record.responseTime}ms
                        </span>
                        {isResponseTimeHigh && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                      </>
                    ) : 'N/A'}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
