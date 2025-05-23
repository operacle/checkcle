
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MaintenanceStatusDropdown } from './MaintenanceStatusDropdown';
import { MaintenanceActionsMenu } from './MaintenanceActionsMenu';
import { MaintenanceDetailDialog } from './detail-dialog/MaintenanceDetailDialog';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyMaintenanceState } from './EmptyMaintenanceState';

interface MaintenanceTableProps {
  data: MaintenanceItem[];
  isLoading?: boolean;
  onMaintenanceUpdated: () => void;
}

export const MaintenanceTable = ({ data, isLoading = false, onMaintenanceUpdated }: MaintenanceTableProps) => {
  const { t } = useLanguage();
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Memoize the formatted date function to avoid recreating it on each render
  const formatDate = useMemo(() => (dateString: string) => {
    if (!dateString) return '-';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return dateString || '-';
    }
  }, []);

  const handleViewMaintenance = (maintenance: MaintenanceItem) => {
    setSelectedMaintenance(maintenance);
    setDetailDialogOpen(true);
  };

  if (isLoading) {
    // Render skeleton loading state with table structure for smoother transitions
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('title')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('scheduledStart')}</TableHead>
            <TableHead>{t('scheduledEnd')}</TableHead>
            <TableHead>{t('affectedServices')}</TableHead>
            <TableHead>{t('impact')}</TableHead>
            <TableHead className="w-[80px]">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map(i => (
            <TableRow key={`skeleton-${i}`}>
              <TableCell><Skeleton className="h-6 w-28" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell><Skeleton className="h-6 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyMaintenanceState />;
  }

  // Memoize the impact badge variant calculation
  const getImpactBadgeVariant = (field: string | undefined) => {
    const fieldLower = field?.toLowerCase() || '';
    if (fieldLower === 'critical') return 'destructive';
    if (fieldLower === 'major') return 'default';
    if (fieldLower === 'minor') return 'secondary';
    return 'outline';
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('title')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('scheduledStart')}</TableHead>
            <TableHead>{t('scheduledEnd')}</TableHead>
            <TableHead>{t('affectedServices')}</TableHead>
            <TableHead>{t('impact')}</TableHead>
            <TableHead className="w-[80px]">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-muted/40">
              <TableCell className="font-medium" onClick={() => handleViewMaintenance(item)}>
                {item.title || '-'}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <MaintenanceStatusDropdown 
                  status={item.status} 
                  id={item.id} 
                  onStatusUpdated={onMaintenanceUpdated} 
                />
              </TableCell>
              <TableCell onClick={() => handleViewMaintenance(item)}>
                {formatDate(item.start_time)}
              </TableCell>
              <TableCell onClick={() => handleViewMaintenance(item)}>
                {formatDate(item.end_time)}
              </TableCell>
              <TableCell onClick={() => handleViewMaintenance(item)}>
                <div className="flex flex-wrap gap-1">
                  {item.affected ? item.affected.split(',').slice(0, 2).map((service, index) => (
                    <Badge key={index} variant="outline">{service.trim()}</Badge>
                  )) : '-'}
                  {item.affected && item.affected.split(',').length > 2 && (
                    <Badge variant="outline">+{item.affected.split(',').length - 2}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell onClick={() => handleViewMaintenance(item)}>
                <Badge variant={getImpactBadgeVariant(item.field)}>
                  {item.field ? t(item.field.toLowerCase()) : '-'}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <MaintenanceActionsMenu 
                  item={item} 
                  onMaintenanceUpdated={onMaintenanceUpdated} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <MaintenanceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        maintenance={selectedMaintenance}
      />
    </>
  );
};
