
import { format } from "date-fns";
import { UptimeData } from "@/types/service.types";
import { getStatusInfo } from "./utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface IncidentTableProps {
  incidents: UptimeData[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  if (incidents.length === 0) {
    return null;
  }

  return (
    <Table className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
      <TableHeader className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
        <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t("time")}</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t("status")}</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t("responseTime")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((check, index) => {
          const statusInfo = getStatusInfo(check.status);
          const timestamp = new Date(check.timestamp);
          
          return (
            <TableRow key={check.id || `incident-${index}`} className={theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-200 hover:bg-gray-50'}>
              <TableCell>
                <div className="flex flex-col">
                  <span>{format(timestamp, 'MMM dd, yyyy')}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(timestamp, 'h:mm a')}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {statusInfo.badge}
                </div>
              </TableCell>
              <TableCell className={`font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {check.status !== "paused" && check.responseTime > 0 
                  ? `${check.responseTime}ms` 
                  : "N/A"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
