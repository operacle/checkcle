
import { monitoringIntervals } from './monitoringIntervals';
import { checkHttpService } from './httpChecker';
import { 
  startMonitoringService, 
  pauseMonitoring, 
  resumeMonitoring, 
  startAllActiveServices 
} from './service-status';

export const monitoringService = {
  startMonitoringService,
  pauseMonitoring,
  resumeMonitoring,
  checkHttpService,
  startAllActiveServices
};
