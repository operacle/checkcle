
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Play, Pause, Square, Trash2, BarChart3, RefreshCw } from "lucide-react";
import { DockerContainer } from "@/types/docker.types";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockerRowActionsProps {
  container: DockerContainer;
  containerStatus: 'running' | 'stopped' | 'warning';
  onContainerAction: (action: string, containerId: string, containerName: string) => void;
  onViewMetrics: (container: DockerContainer) => void;
}

export const DockerRowActions = ({ container, containerStatus, onContainerAction, onViewMetrics }: DockerRowActionsProps) => {
  const { t } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
          <span className="sr-only">{t('openMenu', 'docker')}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-md">
        <DropdownMenuItem 
          onClick={() => onViewMetrics(container)}
          className="cursor-pointer hover:bg-muted"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          {t('viewMetrics', 'docker')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onContainerAction('view-detail', container.id, container.name)}
          className="cursor-pointer hover:bg-muted"
        >
          <Eye className="mr-2 h-4 w-4" />
          {t('viewDetails', 'docker')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};