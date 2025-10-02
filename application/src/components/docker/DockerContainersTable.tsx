
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { DockerContainer } from "@/types/docker.types";
import { DockerMetricsDialog } from "./DockerMetricsDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DockerTableSearch, 
  DockerTableHeader, 
  DockerTableRow, 
  DockerEmptyState 
} from "./table";

interface DockerContainersTableProps {
  containers: DockerContainer[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const DockerContainersTable = ({ containers, isLoading, onRefresh }: DockerContainersTableProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null);
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);

  const filteredContainers = containers.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.docker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.hostname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContainerAction = (action: string, containerId: string, containerName: string) => {
    console.log(`${action} action for container ${containerName} (${containerId})`);
    // TODO: Implement container actions
  };

  const handleRowClick = (container: DockerContainer) => {
    setSelectedContainer(container);
    setMetricsDialogOpen(true);
  };

  const handleViewMetrics = (container: DockerContainer) => {
    setSelectedContainer(container);
    setMetricsDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full bg-transparent border-0 shadow-none">
        <CardHeader className="pb-4 px-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl font-semibold">{t('dockerContainers', 'docker')}</CardTitle>
              <DockerTableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={onRefresh}
                isLoading={isLoading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border border-border rounded-lg shadow-sm">
                <Table>
                  <DockerTableHeader />
                  <TableBody>
                    {filteredContainers.length === 0 ? (
                      <DockerEmptyState searchTerm={searchTerm} />
                    ) : (
                      filteredContainers.map((container) => (
                        <DockerTableRow
                          key={container.id}
                          container={container}
                          onRowClick={handleRowClick}
                          onContainerAction={handleContainerAction}
                          onViewMetrics={handleViewMetrics}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DockerMetricsDialog
        container={selectedContainer}
        open={metricsDialogOpen}
        onOpenChange={setMetricsDialogOpen}
      />
    </>
  );
};