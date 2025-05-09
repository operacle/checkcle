
import { Service } from "@/types/service.types";

/**
 * Prepare service for notification by converting from PocketBase format to our Service type
 */
export function prepareServiceForNotification(pbRecord: any, status: string, responseTime: number = 0): Service {
  // Extract notification channel and template IDs
  // Handle both naming conventions for backward compatibility
  const notificationChannel = pbRecord.notification_id || pbRecord.notificationChannel || null;
  const alertTemplate = pbRecord.template_id || pbRecord.alertTemplate || null;
  const muteAlerts = pbRecord.mute_alerts !== undefined ? pbRecord.mute_alerts : 
                    (pbRecord.muteAlerts !== undefined ? pbRecord.muteAlerts : false);
  
  console.log(`Preparing service for notification: ${pbRecord.name}, Mute Alerts: ${muteAlerts ? "YES" : "NO"}`);

  // Return a standardized Service object for notification
  return {
    id: pbRecord.id,
    name: pbRecord.name,
    url: pbRecord.url,
    type: pbRecord.type || pbRecord.service_type || "HTTP",
    status: status as any,
    responseTime: responseTime,
    uptime: pbRecord.uptime || 0,
    lastChecked: new Date().toISOString(),
    interval: pbRecord.interval || pbRecord.heartbeat_interval || 60,
    retries: pbRecord.retries || pbRecord.max_retries || 3,
    notificationChannel,
    alertTemplate,
    muteAlerts
  };
}

// Utility function to add 'https://' to URLs if they don't have a protocol
export function ensureHttpsProtocol(url: string): string {
  // Check if the URL starts with a protocol
  if (!/^[a-z]+:\/\//i.test(url)) {
    // If not, prepend https://
    return `https://${url}`;
  }
  return url;
}

// Utility function to format a PocketBase record ID for display
export function formatRecordId(id: string): string {
  if (!id) return '';
  
  // Return the first 8 characters followed by '...'
  return id.length > 8 ? `${id.substring(0, 8)}...` : id;
}

/**
 * Format current time for display
 */
export function formatCurrentTime(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Make an HTTP request to a service endpoint with retry logic
 * Improved to better handle different response scenarios and detection issues
 */
export async function makeHttpRequest(url: string, maxRetries: number = 3): Promise<{ isUp: boolean; responseTime: number }> {
  let retries = 0;
  let isUp = false;
  let responseTime = 0;
  let lastError = null;
  
  const startTime = performance.now();
  
  try {
    // Ensure URL has proper protocol
    const targetUrl = ensureHttpsProtocol(url);
    
    while (retries < maxRetries && !isUp) {
      try {
        // Use fetch API with a timeout to prevent long-hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        console.log(`Attempt ${retries + 1}/${maxRetries} checking ${targetUrl}`);
        
        // IMPROVED APPROACH: Try multiple detection methods in sequence
        
        // Method 1: Try HEAD request first as it's lightweight
        try {
          console.log(`Trying HEAD request to ${targetUrl}`);
          const headResponse = await fetch(targetUrl, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-cache',
            headers: {
              'Accept': '*/*',
              'User-Agent': 'ServiceMonitor/1.0'
            }
          });
          
          // If HEAD request succeeds with any status code, service is reachable
          isUp = true;
          console.log(`HEAD request successful with status ${headResponse.status}`);
        } catch (headError) {
          console.log(`HEAD request failed: ${headError.message}`);
          lastError = headError;
          
          // Method 2: Fall back to standard GET with proper error handling
          try {
            console.log(`Trying standard GET request to ${targetUrl}`);
            const getResponse = await fetch(targetUrl, {
              method: 'GET',
              signal: controller.signal,
              cache: 'no-cache',
              headers: {
                'Accept': '*/*',
                'User-Agent': 'ServiceMonitor/1.0'
              }
            });
            
            // If GET returns any response, consider the service up
            isUp = true;
            console.log(`GET request successful with status ${getResponse.status}`);
          } catch (getError) {
            console.log(`Standard GET request failed: ${getError.message}`);
            lastError = getError;
            
            // Method 3: Try with no-cors mode as a last resort
            try {
              console.log(`Trying no-cors GET request to ${targetUrl}`);
              const noCorsResponse = await fetch(targetUrl, {
                method: 'GET', 
                mode: 'no-cors',  // This allows requests to succeed even if CORS is restricted
                signal: controller.signal,
                cache: 'no-cache'
              });
              
              // In no-cors mode, we can't read the response, but if we get here without an exception, 
              // the request succeeded and the service is likely up
              isUp = true;
              console.log(`No-cors GET request succeeded, assuming service is UP`);
            } catch (corsError) {
              console.log(`No-cors GET request also failed: ${corsError.message}`);
              lastError = corsError;
              isUp = false;
            }
            
            // Method 4: If all fetches fail but error is CORS-related, consider service up
            if (!isUp && lastError && 
                (lastError.message.includes('CORS') || 
                 lastError.message.includes('blocked') || 
                 lastError.message.includes('policy'))) {
              console.log("CORS error detected, but this likely means the service is running.");
              console.log("Setting service as UP despite CORS restriction.");
              isUp = true;
            }
          }
        }
        
        clearTimeout(timeoutId);
        responseTime = Math.round(performance.now() - startTime);
        
        if (isUp) {
          console.log(`Service is detected as UP after ${retries + 1} attempts, response time: ${responseTime}ms`);
          break;
        } else {
          console.log(`All connection attempts failed for attempt ${retries + 1}`);
          retries++;
          
          // Add a short delay between retries
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error(`HTTP request attempt ${retries + 1} failed with error:`, error);
        lastError = error;
        retries++;
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  } catch (error) {
    console.error('Critical error in makeHttpRequest:', error);
    isUp = false;
    responseTime = Math.round(performance.now() - startTime);
    lastError = error;
  }
  
  // Final check for status
  if (!isUp && lastError) {
    console.log("Final connection attempt failed with error:", lastError);
    // Check for specific errors that might indicate the site is actually up
    if (lastError.name === 'AbortError') {
      console.log("Request timed out which may indicate a slow response rather than service down");
    }
  }
  
  // Log the final result for debugging
  console.log(`Final service check result - URL: ${url}, isUp: ${isUp}, responseTime: ${responseTime}ms, retries: ${retries}`);
  
  return { isUp, responseTime };
}
