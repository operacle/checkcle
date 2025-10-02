
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

export const DockerTableHeader = () => {
  const { t } = useLanguage();
  return (
    <TableHeader>
      <TableRow className="border-border bg-muted/30">
        <TableHead className="min-w-[200px] font-semibold">{t('container', 'docker')}</TableHead>
        <TableHead className="min-w-[100px] font-semibold">{t('status', 'docker')}</TableHead>
        <TableHead className="min-w-[140px] font-semibold">{t('cpuUsage', 'docker')}</TableHead>
        <TableHead className="min-w-[160px] font-semibold">{t('memory', 'docker')}</TableHead>
        <TableHead className="min-w-[160px] font-semibold">{t('disk', 'docker')}</TableHead>
        <TableHead className="min-w-[100px] font-semibold">{t('uptime', 'docker')}</TableHead>
        <TableHead className="min-w-[160px] font-semibold">{t('lastChecked', 'docker')}</TableHead>
        <TableHead className="min-w-[80px] text-center font-semibold">{t('actions', 'docker')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};