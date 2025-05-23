
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem } from '@/services/incident';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/services/userService';
import { getUserInitials } from './utils';

interface AssignmentSectionProps {
  incident: IncidentItem | null;
  assignedUser?: User | null;
}

export const AssignmentSection: React.FC<AssignmentSectionProps> = ({ incident, assignedUser }) => {
  const { t } = useLanguage();
  
  if (!incident) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('assignment')}</h3>
      
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{t('assignedTo')}</h4>
        <div className="mt-1">
          {assignedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignedUser.avatar} alt={assignedUser.full_name || assignedUser.username} />
                <AvatarFallback>{getUserInitials(assignedUser)}</AvatarFallback>
              </Avatar>
              <span>{assignedUser.full_name || assignedUser.username}</span>
            </div>
          ) : incident.assigned_to ? (
            <span>{incident.assigned_to}</span>
          ) : (
            <span className="text-muted-foreground italic">{t('unassigned')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

