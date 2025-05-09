
import { useState, useEffect, useMemo } from "react";
import { UptimeData } from "@/types/service.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusFilterTabs } from "./StatusFilterTabs";
import { TablePagination } from "./TablePagination";
import { EmptyState } from "./EmptyState";
import { IncidentTable } from "./IncidentTable";
import { StatusFilter, PageSize } from "./types";
import { getStatusChangeEvents } from "./utils";
import { useTheme } from "@/contexts/ThemeContext";

export function LatestChecksTable({ uptimeData }: { uptimeData: UptimeData[] }) {
  // Get current theme
  const { theme } = useTheme();
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>("25");
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, pageSize]);

  // Filter incidents by status
  const incidents = useMemo(() => {
    const statusChanges = getStatusChangeEvents(uptimeData);
    console.log(`Total status changes: ${statusChanges.length}`);
    console.log(`Status types in incidents: ${[...new Set(statusChanges.map(i => i.status))].join(', ')}`);
    
    if (statusFilter === "all") return statusChanges;
    
    return statusChanges.filter(incident => incident.status === statusFilter);
  }, [uptimeData, statusFilter]);

  // Calculate pagination
  const { paginatedIncidents, totalPages } = useMemo(() => {
    if (pageSize === "all") {
      return {
        paginatedIncidents: incidents,
        totalPages: 1,
      };
    }
    
    const itemsPerPage = parseInt(pageSize, 10);
    const pages = Math.ceil(incidents.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      paginatedIncidents: incidents.slice(start, end),
      totalPages: Math.max(1, pages),
    };
  }, [incidents, currentPage, pageSize]);

  // Calculate items per page for pagination display
  const itemsPerPage = pageSize === "all" ? incidents.length : parseInt(pageSize, 10);

  console.log(`Status Filter: ${statusFilter}, Incidents: ${incidents.length}, Includes paused: ${incidents.some(i => i.status === 'paused')}`);

  return (
    <Card className={`mb-6 transition-colors ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-card-foreground">
            <span>Incident History</span>
          </CardTitle>
          <StatusFilterTabs statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <EmptyState statusFilter={statusFilter} />
        ) : (
          <>
            <IncidentTable incidents={paginatedIncidents} />
            
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={incidents.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
