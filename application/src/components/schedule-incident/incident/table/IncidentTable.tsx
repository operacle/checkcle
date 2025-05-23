
import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { IncidentItem } from '@/services/incident/types';
import { IncidentTableRow } from './IncidentTableRow';
import { IncidentDetailDialog } from '../detail-dialog/IncidentDetailDialog';
import { EditIncidentDialog } from '../EditIncidentDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentTableSkeleton } from './IncidentTableSkeleton';

interface IncidentTableProps {
  data: IncidentItem[]; 
  isLoading: boolean;
  onIncidentUpdated: () => void;
  onViewDetails?: (incident: IncidentItem) => void;
  onEditIncident?: (incident: IncidentItem) => void;
}

export const IncidentTable = ({ 
  data, 
  isLoading,
  onIncidentUpdated,
  onViewDetails,
  onEditIncident 
}: IncidentTableProps) => {
  const { t } = useLanguage();
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  }, []);

  const getAffectedSystemsArray = useCallback((affectedSystems: string | undefined): string[] => {
    if (!affectedSystems) return [];
    return affectedSystems.split(',').map(system => system.trim()).filter(Boolean);
  }, []);

  const handleViewDetails = useCallback((incident: IncidentItem) => {
    setSelectedIncident(incident);
    setIsDetailOpen(true);
  }, []);
  
  const handleEditIncident = useCallback((incident: IncidentItem) => {
    setSelectedIncident(incident);
    setIsEditOpen(true);
  }, []);

  // Handle status updates efficiently
  const handleIncidentUpdated = useCallback(() => {
    console.log("Incident updated in IncidentTable, propagating event");
    onIncidentUpdated();
  }, [onIncidentUpdated]);

  // Handle dialog closing
  const handleDetailDialogClose = useCallback((open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      onIncidentUpdated();
    }
  }, [onIncidentUpdated]);

  // Handle edit dialog closing
  const handleEditDialogClose = useCallback((open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      onIncidentUpdated();
    }
  }, [onIncidentUpdated]);

  if (isLoading) {
    return <IncidentTableSkeleton />;
  }

  // Add a safety check to prevent map of undefined error
  if (!data || !Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return (
      <div className="p-4 text-center">
        <p>No incident data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('title')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('priority')}</TableHead>
              <TableHead>{t('time')}</TableHead>
              <TableHead>{t('affected')}</TableHead>
              <TableHead>{t('impact')}</TableHead>
              <TableHead>{t('assignedTo')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <IncidentTableRow
                key={item.id}
                item={item}
                formatDate={formatDate}
                getAffectedSystemsArray={getAffectedSystemsArray}
                onViewDetails={onViewDetails || handleViewDetails}
                onEditIncident={onEditIncident || handleEditIncident}
                onIncidentUpdated={handleIncidentUpdated}
                t={t}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Incident detail dialog */}
      <IncidentDetailDialog
        open={isDetailOpen}
        onOpenChange={handleDetailDialogClose}
        incident={selectedIncident}
      />
      
      {/* Edit incident dialog */}
      {selectedIncident && (
        <EditIncidentDialog
          open={isEditOpen}
          onOpenChange={handleEditDialogClose}
          incident={selectedIncident}
          onIncidentUpdated={onIncidentUpdated}
        />
      )}
    </>
  );
};
