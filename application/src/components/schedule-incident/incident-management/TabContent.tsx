
import React from 'react';
import { IncidentTable } from '../incident/table/IncidentTable';
import { EmptyIncidentState } from '../incident/EmptyIncidentState';
import { ErrorState } from './ErrorState';
import { IncidentItem } from '@/services/incident';

interface TabContentProps {
  error: string | null;
  isEmpty: boolean;
  data: IncidentItem[];
  loading: boolean;
  initialized: boolean;
  isRefreshing: boolean;
  onIncidentUpdated: () => void;
  onViewDetails: (incident: IncidentItem) => void;
  onRefresh: () => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  error,
  isEmpty,
  data,
  loading,
  initialized,
  isRefreshing,
  onIncidentUpdated,
  onViewDetails,
  onRefresh
}) => {
  if (error) {
    return <ErrorState error={error} onRefresh={onRefresh} isRefreshing={isRefreshing} />;
  }
  
  if (isEmpty) {
    return <EmptyIncidentState />;
  }
  
  return (
    <IncidentTable 
      data={data}
      onIncidentUpdated={onIncidentUpdated}
      onViewDetails={onViewDetails}
      isLoading={loading && initialized}
    />
  );
};
