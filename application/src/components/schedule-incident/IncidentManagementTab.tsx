
import React from 'react';
import { IncidentManagementContainer } from './incident-management';

interface IncidentManagementTabProps {
  refreshTrigger?: number;
}

export const IncidentManagementTab = React.memo(({ refreshTrigger = 0 }: IncidentManagementTabProps) => {
  return <IncidentManagementContainer refreshTrigger={refreshTrigger} />;
});

IncidentManagementTab.displayName = 'IncidentManagementTab';
