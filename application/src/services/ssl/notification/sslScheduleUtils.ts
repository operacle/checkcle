
/**
 * Check if SSL certificate daily check should run
 * This helps implement the once-per-day check logic
 */
export function shouldRunDailyCheck(): boolean {
    const lastRunKey = 'ssl_daily_check_last_run';
    const lastRun = localStorage.getItem(lastRunKey);
    
    if (!lastRun) {
      // First time running, save timestamp and run
      localStorage.setItem(lastRunKey, new Date().toISOString());
      return true;
    }
    
    const lastRunDate = new Date(lastRun).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    
    // If last run was not today, run again
    if (lastRunDate < today) {
      localStorage.setItem(lastRunKey, new Date().toISOString());
      return true;
    }
    
    // Already ran today
    return false;
  }