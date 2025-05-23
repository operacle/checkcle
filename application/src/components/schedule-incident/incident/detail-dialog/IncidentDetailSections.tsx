import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem } from '@/services/incident';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

// Import all section components from the new location
import {
  BasicInfoSection,
  TimelineSection,
  AffectedSystemsSection,
  ResolutionSection
} from './sections';

// Re-export all section components for compatibility with existing imports
export {
  BasicInfoSection,
  TimelineSection,
  AffectedSystemsSection,
  ResolutionSection
};

// Legacy component - keeping this for backward compatibility with other imports
export const IncidentDetailSections = ({ incident }: { incident: IncidentItem | null }) => {
  // Fetch assigned user details if there's an assigned_to field
  const { data: assignedUser } = useQuery({
    queryKey: ['user', incident?.assigned_to],
    queryFn: async () => {
      if (!incident?.assigned_to) return null;
      try {
        return await userService.getUser(incident.assigned_to);
      } catch (error) {
        console.error("Failed to fetch assigned user:", error);
        return null;
      }
    },
    enabled: !!incident?.assigned_to,
    staleTime: 300000 // Cache for 5 minutes
  });

  if (!incident) return null;

  return (
    <div className="space-y-6">
      <BasicInfoSection incident={incident} assignedUser={assignedUser} />
      <Separator />
      <TimelineSection incident={incident} assignedUser={assignedUser} />
      <Separator />
      <AffectedSystemsSection incident={incident} assignedUser={assignedUser} />
      <Separator />
      <ResolutionSection incident={incident} assignedUser={assignedUser} />
    </div>
  );
};
