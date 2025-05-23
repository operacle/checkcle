
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
      console.log("Fetched users for maintenance detail:", usersList);
      return usersList || [];
    },
    enabled: true
  });

  // Fetch notification channels for notification channel display
  const { data: notificationChannels = [] } = useQuery({
    queryKey: ['notificationChannels'],
    queryFn: async () => {
      const channels = await alertConfigService.getAlertConfigurations();
      console.log("Fetched notification channels:", channels);
      return channels || [];
    },
    enabled: true
  });
  
  // Process user information when users data is available
  useEffect(() => {
    if (users.length > 0 && maintenance) {
      console.log("Processing maintenance data with users:", maintenance);
      console.log("Maintenance assigned_users:", maintenance.assigned_users);
      
      // Create a copy of the maintenance object for modifications
      const enhancedMaintenance = { ...maintenance };
      
      // Process assigned users
      if (maintenance.assigned_users) {
        let userIds: string[] = [];
        
        // Step 1: Extract user IDs from various formats
        if (Array.isArray(maintenance.assigned_users)) {
          userIds = maintenance.assigned_users;
          console.log("Assigned users is an array:", userIds);
        } else if (typeof maintenance.assigned_users === 'string') {
          // Try parsing the string to extract user IDs
          try {
            // Try parsing as JSON first
            const parsedData = JSON.parse(maintenance.assigned_users);
            if (Array.isArray(parsedData)) {
              // Direct array format
              userIds = parsedData;
              console.log("Parsed assigned_users from JSON array:", userIds);
            } else if (typeof parsedData === 'string') {
              // Nested JSON string
              try {
                const nestedData = JSON.parse(parsedData);
                if (Array.isArray(nestedData)) {
                  userIds = nestedData;
                  console.log("Parsed assigned_users from nested JSON:", userIds);
                }
              } catch (e) {
                // If nested parsing fails, treat as single ID
                userIds = [parsedData];
                console.log("Using parsed string as single ID:", userIds);
              }
            } else {
              // Unknown format, use as is
              userIds = [String(parsedData)];
              console.log("Using parsed data as single ID:", userIds);
            }
          } catch (e) {
            // If JSON parsing fails, try comma splitting
            if (maintenance.assigned_users.includes(',')) {
              userIds = maintenance.assigned_users.split(',').map(id => id.trim()).filter(Boolean);
              console.log("Split assigned_users by comma:", userIds);
            } else {
              // Single ID
              userIds = [maintenance.assigned_users];
              console.log("Using string as single ID:", userIds);
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
        
        console.log("Cleaned user IDs:", userIds);
          
        // Step 3: Find matching users from the users array
        if (userIds.length > 0) {
          const matchedUsers = users.filter(user => userIds.includes(user.id));
          console.log("Matched assigned users:", matchedUsers);
          setAssignedUsers(matchedUsers);
        } else {
          console.log("No user IDs found in assigned_users");
          setAssignedUsers([]);
        }
      } else {
        console.log("No assigned users found in maintenance data");
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
          console.log("Looking for notification channel with ID:", channelId);
          console.log("Available notification channels:", notificationChannels.map(c => ({ id: c.id, name: c.notify_name })));
          
          const channel = notificationChannels.find(ch => ch.id === channelId);
          if (channel) {
            console.log("Found notification channel:", channel);
            enhancedMaintenance.notification_channel_name = `${channel.notify_name} (${channel.notification_type})`;
          } else {
            console.log("No matching notification channel found for ID:", channelId);
            enhancedMaintenance.notification_channel_name = `Channel ID: ${channelId}`;
          }
        } else {
          console.log("No channel ID available or no notification channels loaded");
        }
      }
      
      console.log("Enhanced maintenance with details:", enhancedMaintenance);
      console.log("Assigned users for display:", assignedUsers);
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
