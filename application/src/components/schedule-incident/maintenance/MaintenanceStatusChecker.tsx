
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

  useEffect(() => {
    if (!maintenanceData || maintenanceData.length === 0) return;

    // Check for maintenance items that need status update
    const now = new Date();
    const checkAndUpdateStatus = async () => {
      for (const item of maintenanceData) {
        if (item.status.toLowerCase() !== 'scheduled') continue;
        
        // Skip if we've already checked this item in this session
        if (checkedItemsRef.current.has(item.id)) continue;
        
        try {
          const startTime = new Date(item.start_time);
          const endTime = new Date(item.end_time);
          
          // If current time is past start time but before end time, update to in_progress
          if (startTime <= now && now <= endTime) {
            console.log(`Auto-updating maintenance ${item.title} to in_progress status`);
            
            // Update status to in_progress
            await maintenanceService.updateMaintenanceStatus(item.id, 'in_progress');
            
            // Only send notification if not sent before
            if (!notificationSentRef.current.has(item.id)) {
              console.log(`Sending start notification for maintenance ${item.title}`);
              
              // Send notification for maintenance start
              await maintenanceNotificationService.sendMaintenanceNotification({
                maintenance: item,
                notificationType: 'start'
              });
              
              // Mark as notified
              notificationSentRef.current.add(item.id);
            }
            
            toast({
              title: t('maintenanceInProgress'),
              description: `${item.title} ${t('isNowInProgress')}`,
            });
            
            onStatusUpdated();
          }
          
          // Mark as checked regardless of outcome
          checkedItemsRef.current.add(item.id);
        } catch (error) {
          console.error(`Error auto-updating maintenance status for ${item.id}:`, error);
          
          // Add a small delay before trying again to prevent rapid retry cycles
          setTimeout(() => {
            checkedItemsRef.current.delete(item.id); // Allow retry on next check
          }, 300000); // 5 minutes before retry
        }
      }
    };

    // Run the check immediately
    checkAndUpdateStatus();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkAndUpdateStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, [maintenanceData, onStatusUpdated, t, toast]);

  // This is a utility component with no UI render
  return null;
};
