
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Service } from "@/types/service.types";
import { ServiceRow } from "@/components/services/ServiceRow";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServicesTableViewProps {
  services: Service[];
  onViewDetail: (service: Service) => void;
  onPauseResume: (service: Service) => Promise<void>;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onMuteAlerts?: (service: Service) => Promise<void>;
}

export const ServicesTableView = ({ 
  services,
  onViewDetail,
  onPauseResume,
  onEdit,
  onDelete,
  onMuteAlerts
}: ServicesTableViewProps) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden border border-border flex-1 flex flex-col shadow-sm`}>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} sticky top-0 z-10`}>
            <TableRow className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'}`}>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("serviceName")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("serviceType")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("serviceStatus")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("responseTime")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("uptime")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("lastChecked")}</TableHead>
              <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceRow 
                  key={service.id}
                  service={service}
                  onViewDetail={onViewDetail}
                  onPauseResume={onPauseResume}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMuteAlerts={onMuteAlerts}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className={`text-center py-8 text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {t("noServices")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
