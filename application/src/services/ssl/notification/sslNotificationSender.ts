
import { pb } from "@/lib/pocketbase";
import { SSLCertificate, SSLNotification } from "../types";
import { AlertConfiguration } from "@/services/alertConfigService";

/**
 * Dedicated function to send SSL certificate notifications
 */
export async function sendSSLNotification(
  certificate: SSLCertificate, 
  message: string, 
  isCritical: boolean
): Promise<boolean> {
  try {
    // Check if notification channel is set
    if (!certificate.notification_channel) {
      console.log(`No notification channel set for certificate: ${certificate.domain}`);
      return false;
    }
    
    // Fetch the notification configuration
    const alertConfigRecord = await pb.collection('alert_configurations').getOne(certificate.notification_channel);
    
    if (!alertConfigRecord) {
      console.error(`Alert configuration not found for ID: ${certificate.notification_channel}`);
      return false;
    }
    
    if (!alertConfigRecord.enabled) {
      console.log(`Alert configuration is disabled for certificate: ${certificate.domain}`);
      return false;
    }
    
    // Convert PocketBase record to AlertConfiguration
    const alertConfig: AlertConfiguration = {
      id: alertConfigRecord.id,
      collectionId: alertConfigRecord.collectionId,
      collectionName: alertConfigRecord.collectionName,
      service_id: alertConfigRecord.service_id || "",
      notification_type: alertConfigRecord.notification_type,
      telegram_chat_id: alertConfigRecord.telegram_chat_id,
      discord_webhook_url: alertConfigRecord.discord_webhook_url,
      signal_number: alertConfigRecord.signal_number,
      notify_name: alertConfigRecord.notify_name,
      bot_token: alertConfigRecord.bot_token,
      template_id: alertConfigRecord.template_id,
      slack_webhook_url: alertConfigRecord.slack_webhook_url,
      enabled: alertConfigRecord.enabled,
      created: alertConfigRecord.created,
      updated: alertConfigRecord.updated
    };
    
    // Create an SSL notification object for tracking
    const sslNotification: SSLNotification = {
      certificateId: certificate.id,
      domain: certificate.domain,
      message: message,
      isCritical: isCritical,
      timestamp: new Date().toISOString()
    };
    
    // Send the notification based on the notification type
    return await sendNotificationByType(alertConfig, certificate, message, isCritical, sslNotification);
    
  } catch (error) {
    console.error("Error sending SSL notification:", error);
    return false;
  }
}

/**
 * Send notification based on notification channel type
 */
async function sendNotificationByType(
  alertConfig: AlertConfiguration,
  certificate: SSLCertificate,
  message: string,
  isCritical: boolean,
  notification: SSLNotification
): Promise<boolean> {
  switch (alertConfig.notification_type) {
    case 'telegram':
      return await sendTelegramNotification(alertConfig, certificate, message, isCritical);
    // Add other notification types as they are implemented
    // case 'discord':
    //   return await sendDiscordNotification(alertConfig, certificate, message, isCritical);
    // case 'slack':
    //   return await sendSlackNotification(alertConfig, certificate, message, isCritical);
    default:
      console.log(`Notification type ${alertConfig.notification_type} not implemented yet for SSL certificates`);
      return false;
  }
}

/**
 * Send notification via Telegram
 */
async function sendTelegramNotification(
  alertConfig: AlertConfiguration,
  certificate: SSLCertificate,
  message: string,
  isCritical: boolean
): Promise<boolean> {
  if (!alertConfig.bot_token || !alertConfig.telegram_chat_id) {
    console.error("Missing Telegram bot token or chat ID");
    return false;
  }
  
  const telegramUrl = `https://api.telegram.org/bot${alertConfig.bot_token}/sendMessage`;
  const severity = isCritical ? "🚨 CRITICAL" : "⚠️ WARNING";
  
  // Enhanced message with more SSL certificate details
  const enhancedMessage = `${severity}: SSL Certificate Alert
  
Domain: ${certificate.domain}
Days Remaining: ${certificate.days_left}
Expiration Date: ${certificate.valid_till}
Status: ${certificate.status.toUpperCase()}

${message}

This is an automated notification from your SSL certificate monitoring system.`;
  
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: alertConfig.telegram_chat_id,
        text: enhancedMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    return false;
  }
}