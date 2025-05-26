
import React, { useEffect, useState } from 'react';
import { userService, User } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { MaintenanceDetailHeader } from './MaintenanceDetailHeader';
import { MaintenanceDetailSections } from './MaintenanceDetailSections';
import { MaintenanceDetailFooter } from './MaintenanceDetailFooter';
import { alertConfigService } from '@/services/alertConfigService';

interface MaintenanceDetailContentProps {
  maintenance: MaintenanceItem;
  onClose: () => void;
}

export const MaintenanceDetailContent = ({ 
  maintenance,
  onClose
}: MaintenanceDetailContentProps) => {
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [maintenanceWithDetails, setMaintenanceWithDetails] = useState<MaintenanceItem>(maintenance);
  
  // Fetch all users to resolve the assigned users and creator
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const usersList = await userService.getUsers();
      return usersList || [];
    },
    enabled: true
  });

  // Fetch notification channels for notification channel display
  const { data: notificationChannels = [] } = useQuery({
    queryKey: ['notificationChannels'],
    queryFn: async () => {
      const channels = await alertConfigService.getAlertConfigurations();
      return channels || [];
    },
    enabled: true
  });
  
  // Process user information when users data is available
  useEffect(() => {
    if (users.length > 0 && maintenance) {
      // Create a copy of the maintenance object for modifications
      const enhancedMaintenance = { ...maintenance };
      
      // Process assigned users
      if (maintenance.assigned_users) {
        let userIds: string[] = [];
        
        // Step 1: Extract user IDs from various formats
        if (Array.isArray(maintenance.assigned_users)) {
          userIds = maintenance.assigned_users;
        } else if (typeof maintenance.assigned_users === 'string') {
          // Try parsing the string to extract user IDs
          try {
            // Try parsing as JSON first
            const parsedData = JSON.parse(maintenance.assigned_users);
            if (Array.isArray(parsedData)) {
              // Direct array format
              userIds = parsedData;
            } else if (typeof parsedData === 'string') {
              // Nested JSON string
              try {
                const nestedData = JSON.parse(parsedData);
                if (Array.isArray(nestedData)) {
                  userIds = nestedData;
                }
              } catch (e) {
                // If nested parsing fails, treat as single ID
                userIds = [parsedData];
              }
            } else {
              // Unknown format, use as is
              userIds = [String(parsedData)];
            }
          } catch (e) {
            // If JSON parsing fails, try comma splitting
            if (maintenance.assigned_users.includes(',')) {
              userIds = maintenance.assigned_users.split(',').map(id => id.trim()).filter(Boolean);
            } else {
              // Single ID
              userIds = [maintenance.assigned_users];
            }
          }
        }
        
        // Step 2: Clean up extracted IDs (remove quotes, brackets, etc.)
        userIds = userIds.map(id => {
          // Remove surrounding quotes if present
          let cleanId = id.replace(/^["']|["']$/g, '');
          // Remove any remaining JSON artifacts
          cleanId = cleanId.replace(/[\[\]"'\\]/g, '');
          return cleanId;
        }).filter(Boolean);
          
        // Step 3: Find matching users from the users array
        if (userIds.length > 0) {
          const matchedUsers = users.filter(user => userIds.includes(user.id));
          setAssignedUsers(matchedUsers);
        } else {
          setAssignedUsers([]);
        }
      } else {
        setAssignedUsers([]);
      }
      
      // Process created_by field - replace ID with full name if available
      if (maintenance?.created_by) {
        const creator = users.find(user => user.id === maintenance.created_by);
        if (creator) {
          enhancedMaintenance.created_by = creator.full_name || creator.username || maintenance.created_by;
        }
      }
      
      // Process notification channel if needed
      if (maintenance.notify_subscribers === 'yes') {
        // Try notification_channel_id first, fall back to notification_id if needed
        const channelId = maintenance.notification_channel_id || maintenance.notification_id;
        
        if (channelId && notificationChannels.length > 0) {
          const channel = notificationChannels.find(ch => ch.id === channelId);
          if (channel) {
            enhancedMaintenance.notification_channel_name = `${channel.notify_name} (${channel.notification_type})`;
          } else {
            enhancedMaintenance.notification_channel_name = `Channel ID: ${channelId}`;
          }
        }
      }
      
      setMaintenanceWithDetails(enhancedMaintenance);
    }
  }, [maintenance, users, notificationChannels]);

  return (
    <>
      <MaintenanceDetailHeader maintenance={maintenanceWithDetails} />
      <MaintenanceDetailSections 
        maintenance={maintenanceWithDetails}
        assignedUsers={assignedUsers}
      />
      <MaintenanceDetailFooter 
        maintenance={maintenanceWithDetails}
        onClose={onClose}
      />
    </>
  );
};