
import { useEffect, useRef } from 'react';
import { maintenanceService } from '@/services/maintenance';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaintenanceItem } from '@/services/types/maintenance.types';
import { maintenanceNotificationService } from '@/services/maintenance/maintenanceNotificationService';

interface MaintenanceStatusCheckerProps {
  maintenanceData: MaintenanceItem[];
  onStatusUpdated: () => void;
}

export const MaintenanceStatusChecker = ({ 
  maintenanceData, 
  onStatusUpdated 
}: MaintenanceStatusCheckerProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const checkedItemsRef = useRef<Set<string>>(new Set());
  const notificationSentRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!maintenanceData || maintenanceData.length === 0) return;

    const checkAndUpdateStatus = async () => {
      const currentTime = new Date();
      let hasUpdates = false;

      console.log('MaintenanceStatusChecker: Checking status updates at', currentTime.toISOString());
      console.log('MaintenanceStatusChecker: Checking', maintenanceData.length, 'maintenance items');

      for (const item of maintenanceData) {
        try {
          const startTime = new Date(item.start_time);
          const endTime = new Date(item.end_time);
          const status = item.status.toLowerCase();
          
          console.log(`MaintenanceStatusChecker: Item ${item.id} - Status: ${status}, Start: ${startTime.toISOString()}, End: ${endTime.toISOString()}, Current: ${currentTime.toISOString()}`);
          
          // Check if scheduled maintenance should start (become in_progress)
          if (status === 'scheduled' && currentTime >= startTime && currentTime <= endTime) {
            const checkKey = `${item.id}-started`;
            const notificationKey = `${item.id}-start-notification`;
            
            if (!checkedItemsRef.current.has(checkKey)) {
              console.log(`MaintenanceStatusChecker: Starting maintenance ${item.id} at ${currentTime.toISOString()}`);
              
              // Update status to in_progress first
              await maintenanceService.updateMaintenanceStatus(item.id, 'in_progress');
              
              // Send start notification only once
              if (!notificationSentRef.current.has(notificationKey)) {
                try {
                  await maintenanceNotificationService.sendMaintenanceNotification({
                    maintenance: item,
                    notificationType: 'start'
                  });
                  notificationSentRef.current.add(notificationKey);
                  console.log(`MaintenanceStatusChecker: Start notification sent for ${item.id}`);
                } catch (notificationError) {
                  console.log('MaintenanceStatusChecker: Start notification failed', notificationError);
                }
              }
              
              toast({
                title: t('maintenanceInProgress'),
                description: `${item.title} ${t('isNowInProgress')}`,
              });
              
              checkedItemsRef.current.add(checkKey);
              hasUpdates = true;
            }
          }
          
          // Check if in_progress maintenance should be completed
          if (status === 'in_progress' && currentTime >= endTime) {
            const checkKey = `${item.id}-completed`;
            const notificationKey = `${item.id}-end-notification`;
            
            if (!checkedItemsRef.current.has(checkKey)) {
              console.log(`MaintenanceStatusChecker: Completing maintenance ${item.id} at ${currentTime.toISOString()}`);
              
              // Update status to completed first
              await maintenanceService.updateMaintenanceStatus(item.id, 'completed');
              
              // Send completion notification only once
              if (!notificationSentRef.current.has(notificationKey)) {
                try {
                  await maintenanceNotificationService.sendMaintenanceNotification({
                    maintenance: item,
                    notificationType: 'end'
                  });
                  notificationSentRef.current.add(notificationKey);
                  console.log(`MaintenanceStatusChecker: Completion notification sent for ${item.id}`);
                } catch (notificationError) {
                  console.log('MaintenanceStatusChecker: Completion notification failed', notificationError);
                }
              }
              
              toast({
                title: t('maintenanceCompleted'),
                description: `${item.title} ${t('hasBeenCompleted')}`,
              });
              
              checkedItemsRef.current.add(checkKey);
              hasUpdates = true;
            }
          }
        } catch (error) {
          console.error('MaintenanceStatusChecker: Error updating status for item', item.id, error);
          // Clear the check flags after 2 minutes to allow retry
          setTimeout(() => {
            checkedItemsRef.current.delete(`${item.id}-started`);
            checkedItemsRef.current.delete(`${item.id}-completed`);
            notificationSentRef.current.delete(`${item.id}-start-notification`);
            notificationSentRef.current.delete(`${item.id}-end-notification`);
          }, 120000);
        }
      }

      if (hasUpdates) {
        console.log('MaintenanceStatusChecker: Status updates detected, triggering refresh');
        // Force immediate refresh to update the UI
        onStatusUpdated();
      }
    };

    // Clear the interval if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial check immediately
    checkAndUpdateStatus();
    
    // Check every 5 seconds for immediate status updates
    intervalRef.current = window.setInterval(checkAndUpdateStatus, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [maintenanceData, onStatusUpdated, t, toast]);

  // Clear check flags when maintenance data changes significantly
  useEffect(() => {
    const currentIds = new Set(maintenanceData.map(item => item.id));
    
    // Clean up check flags for items that no longer exist
    const keysToDelete = Array.from(checkedItemsRef.current).filter(key => {
      const itemId = key.split('-')[0];
      return !currentIds.has(itemId);
    });
    
    keysToDelete.forEach(key => {
      checkedItemsRef.current.delete(key);
    });
    
    // Clean up notification flags for items that no longer exist
    const notificationKeysToDelete = Array.from(notificationSentRef.current).filter(key => {
      const itemId = key.split('-')[0];
      return !currentIds.has(itemId);
    });
    
    notificationKeysToDelete.forEach(key => {
      notificationSentRef.current.delete(key);
    });
  }, [maintenanceData]);

  return null;
};