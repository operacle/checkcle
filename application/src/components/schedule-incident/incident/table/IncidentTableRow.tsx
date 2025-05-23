
import React, { memo, useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { IncidentStatusDropdown } from '../IncidentStatusDropdown';
import { IncidentActionsMenu } from '../IncidentActionsMenu';
import { IncidentItem } from '@/services/incident';
import { AssignedUserCell } from './IncidentTableUtils';

interface IncidentTableRowProps {
  item: IncidentItem;
  formatDate: (date: string | undefined) => string;
  getAffectedSystemsArray: (systems: string | undefined) => string[];
  onViewDetails?: (incident: IncidentItem) => void;
  onEditIncident?: (incident: IncidentItem) => void;
  onIncidentUpdated: () => void;
  t: (key: string) => string;
}

export const IncidentTableRow = memo(({ 
  item, 
  formatDate, 
  getAffectedSystemsArray, 
  onViewDetails, 
  onEditIncident,
  onIncidentUpdated, 
  t
}: IncidentTableRowProps) => {
  // Use local state for optimistic UI updates
  const [localItem, setLocalItem] = useState(item);
  
  // Update local state when props change
  React.useEffect(() => {
    setLocalItem(item);
  }, [item]);
  
  // Handle status updates locally
  const handleStatusUpdated = () => {
    console.log("Status updated in TableRow, calling onIncidentUpdated");
    onIncidentUpdated();
  };
  
  return (
    <TableRow 
      key={localItem.id} 
      className="hover:bg-muted/40 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(localItem)}
    >
      <TableCell className="font-medium max-w-[200px] truncate">
        {localItem.title || localItem.description || '-'}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <IncidentStatusDropdown
          status={localItem.impact_status || localItem.status || 'investigating'}
          id={localItem.id}
          onStatusUpdated={handleStatusUpdated}
        />
      </TableCell>
      <TableCell>
        <Badge variant={
          localItem.priority?.toLowerCase() === 'critical' ? 'destructive' :
          localItem.priority?.toLowerCase() === 'high' ? 'default' :
          localItem.priority?.toLowerCase() === 'medium' ? 'secondary' : 'outline'
        }>
          {t(localItem.priority?.toLowerCase() || 'low')}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(localItem.created)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {getAffectedSystemsArray(localItem.affected_systems).map((system, idx) => (
            <Badge key={`${localItem.id}-system-${idx}`} variant="outline">{system}</Badge>
          ))}
          {getAffectedSystemsArray(localItem.affected_systems).length === 0 && '-'}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={
          localItem.impact?.toLowerCase() === 'critical' ? 'destructive' :
          localItem.impact?.toLowerCase() === 'high' ? 'default' :
          localItem.impact?.toLowerCase() === 'medium' ? 'secondary' : 'outline'
        }>
          {t(localItem.impact?.toLowerCase() || 'low')}
        </Badge>
      </TableCell>
      <TableCell>
        <AssignedUserCell userId={localItem.assigned_to} />
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end items-center space-x-2">
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(localItem);
              }}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t('view')}</span>
            </Button>
          )}
          <IncidentActionsMenu 
            item={localItem} 
            onIncidentUpdated={onIncidentUpdated}
            onViewDetails={onViewDetails}
            onEditIncident={onEditIncident}
          />
        </div>
      </TableCell>
    </TableRow>
  );
});

IncidentTableRow.displayName = 'IncidentTableRow';
