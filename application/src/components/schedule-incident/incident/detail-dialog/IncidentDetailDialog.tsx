
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IncidentItem } from '@/services/incident/types';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { IncidentDetailContent } from './IncidentDetailContent';

interface IncidentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentItem | null;
}

export const IncidentDetailDialog = ({ 
  open, 
  onOpenChange, 
  incident 
}: IncidentDetailDialogProps) => {
  // Fetch user data for assigned_to field
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const usersList = await userService.getUsers();
      return Array.isArray(usersList) ? usersList : [];
    },
    staleTime: 300000, // Cache for 5 minutes
    enabled: !!incident?.assigned_to && open // Only run query if there's an assigned_to value and dialog is open
  });

  // Find the assigned user
  const assignedUser = incident?.assigned_to 
    ? users.find(user => user.id === incident.assigned_to) 
    : null;
  
  if (!incident) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="dialog-content sm:max-w-[700px] max-h-[90vh] p-0
                  print:max-w-none print:max-h-none print:overflow-visible 
                  print:shadow-none print:m-0 print:p-0 print:border-none
                  print:absolute print:left-0 print:top-0 print:w-full print:h-auto"
      >
        <IncidentDetailContent 
          incident={incident}
          onClose={() => onOpenChange(false)}
          assignedUser={assignedUser}
        />
      </DialogContent>
    </Dialog>
  );
};
