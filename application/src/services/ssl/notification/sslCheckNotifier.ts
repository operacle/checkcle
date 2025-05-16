
import { pb } from "@/lib/pocketbase";
import { SSLCertificate } from "../types";
import { checkSSLCertificate } from "../sslCheckerService";
import { determineSSLStatus } from "../sslStatusUtils";
import { sendSSLNotification } from "./sslNotificationSender";
import { toast } from "sonner";

/**
 * Checks all SSL certificates and sends notifications for expiring ones
 * This should be called once per day
 */
export async function checkAllCertificatesAndNotify(): Promise<void> {
  console.log("Starting daily SSL certificates check...");
  
  try {
    // Fetch all SSL certificates from database
    const response = await pb.collection('ssl_certificates').getList(1, 100, {});
    // Properly cast the items as SSLCertificate
    const certificates = response.items as unknown as SSLCertificate[];
    
    console.log(`Found ${certificates.length} certificates to check`);
    
    // Check each certificate
    for (const cert of certificates) {
      await checkCertificateAndNotify(cert);
    }
    
    console.log("Daily SSL certificates check completed");
  } catch (error) {
    console.error("Error during SSL certificates daily check:", error);
  }
}

/**
 * Checks a specific SSL certificate and sends notification if needed
 * This respects the Warning and Expiry Thresholds set on the certificate
 */
export async function checkCertificateAndNotify(certificate: SSLCertificate): Promise<boolean> {
  console.log(`Checking certificate for ${certificate.domain}...`);
  
  try {
    // Get fresh SSL data
    const sslData = await checkSSLCertificate(certificate.domain);
    if (!sslData || !sslData.result) {
      console.error(`Failed to check SSL for ${certificate.domain}`);
      return false;
    }
    
    // Extract days left from the check result
    const daysLeft = sslData.result.days_left || 0;
    
    // Get threshold values (ensure they are numbers)
    const warningThreshold = Number(certificate.warning_threshold) || 30;
    const expiryThreshold = Number(certificate.expiry_threshold) || 7;
    
    console.log(`Certificate ${certificate.domain} thresholds: warning=${warningThreshold}, expiry=${expiryThreshold}, days left=${daysLeft}`);
    
    // Update status based on thresholds
    const status = determineSSLStatus(daysLeft, warningThreshold, expiryThreshold);
    
    // Check if we should send a notification based on thresholds
    let shouldNotify = false;
    let isCritical = false;
    
    // Critical notifications - when days left is less than or equal to expiry threshold
    if (daysLeft <= expiryThreshold) {
      shouldNotify = true;
      isCritical = true;
    } 
    // Warning notifications - when days left is less than or equal to warning threshold but greater than expiry threshold
    else if (daysLeft <= warningThreshold) {
      shouldNotify = true;
      isCritical = false;
    }
    
    console.log(`${certificate.domain}: ${daysLeft} days left, status: ${status}, should notify: ${shouldNotify}, critical: ${isCritical}`);
    
    // Update certificate data in database
    const updateData: Partial<SSLCertificate> = {
      days_left: daysLeft,
      status: status,
      // Other fields from the SSL check that should be updated
      issuer_o: sslData.result.issuer_o || certificate.issuer_o,
      valid_from: sslData.result.valid_from || certificate.valid_from,
      valid_till: sslData.result.valid_till || certificate.valid_till,
      validity_days: sslData.result.validity_days || certificate.validity_days,
      cert_sans: sslData.result.cert_sans,
      cert_alg: sslData.result.cert_alg,
      serial_number: sslData.result.cert_sn
    };
    
    await pb.collection('ssl_certificates').update(certificate.id, updateData);
    
    // Send notification if needed
    if (shouldNotify && certificate.notification_channel) {
      console.log(`Sending notification for ${certificate.domain}`);
      
      // Different message based on expiry threshold
      const message = isCritical
        ? `🚨 CRITICAL: SSL Certificate for ${certificate.domain} will expire in ${daysLeft} days!`
        : `⚠️ WARNING: SSL Certificate for ${certificate.domain} will expire in ${daysLeft} days.`;
      
      // Send the notification using our specialized SSL notification sender
      const notificationSent = await sendSSLNotification(certificate, message, isCritical);
      
      if (notificationSent) {
        // Update last_notified timestamp
        await pb.collection('ssl_certificates').update(certificate.id, {
          last_notified: new Date().toISOString()
        });
        
        console.log(`Notification sent for ${certificate.domain}`);
        // Show toast for manual checks
        toast.success(`Notification sent for ${certificate.domain}`);
        return true;
      } else {
        console.error(`Failed to send notification for ${certificate.domain}`);
        // Show error toast for manual checks
        toast.error(`Failed to send notification for ${certificate.domain}`);
        return false;
      }
    } else if (shouldNotify && !certificate.notification_channel) {
      console.log(`No notification channel set for ${certificate.domain}, skipping notification`);
      toast.info(`No notification channel set for ${certificate.domain}, skipping notification`);
    } else {
      console.log(`No notification needed for ${certificate.domain} (${daysLeft} days left)`);
      // For manual checks, inform the user that thresholds weren't met
      toast.info(`Certificate for ${certificate.domain} is valid (${daysLeft} days left)`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking certificate for ${certificate.domain}:`, error);
    toast.error(`Error checking certificate: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
}

/**
 * Manual trigger for certificate notification test
 * Useful for testing notification channels
 */
export async function testCertificateNotification(certificate: SSLCertificate): Promise<boolean> {
  try {
    console.log(`Testing notification for ${certificate.domain}...`);
    
    // Create test message
    const message = `🧪 TEST: SSL Certificate notification for ${certificate.domain}.`;
    
    // We set isCritical to false for test notifications
    const notificationSent = await sendSSLNotification(certificate, message, false);
    
    if (notificationSent) {
      console.log(`Test notification sent for ${certificate.domain}`);
      toast.success(`Test notification sent for ${certificate.domain}`);
      return true;
    } else {
      console.error(`Failed to send test notification for ${certificate.domain}`);
      toast.error(`Failed to send test notification for ${certificate.domain}`);
      return false;
    }
  } catch (error) {
    console.error(`Error sending test notification for ${certificate.domain}:`, error);
    toast.error(`Error sending test notification: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
}