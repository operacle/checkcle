
import { TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockerEmptyStateProps {
  searchTerm: string;
}

export const DockerEmptyState = ({ searchTerm }: DockerEmptyStateProps) => {
  const { t } = useLanguage();
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-medium">
            {searchTerm ? t('noContainersFound', 'docker') : t('noContainersRunning', 'docker')}
          </div>
          <div className="text-sm">
            {searchTerm ? t('tryAdjustSearch', 'docker') : t('startSomeContainers', 'docker')}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};