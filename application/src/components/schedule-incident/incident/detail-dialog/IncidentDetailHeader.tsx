
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IncidentItem } from '@/services/incident/types';

interface IncidentDetailHeaderProps {
  incident: IncidentItem;
}

export const IncidentDetailHeader = ({ incident }: IncidentDetailHeaderProps) => {
  return (
    <DialogHeader className="mb-4">
      <div className="flex items-center gap-2">
        <DialogTitle className="text-xl">{incident.title || 'Incident Details'}</DialogTitle>
        <span className="text-sm text-muted-foreground">#{incident.id}</span>
      </div>
    </DialogHeader>
  );
};
