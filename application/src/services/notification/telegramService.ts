
import { toast } from "@/hooks/use-toast";
import { AlertConfiguration } from "../alertConfigService";
import api from "@/api";

/**
 * Send a notification via Telegram
 */
export async function sendTelegramNotification(
  config: AlertConfiguration, 
  message: string
): Promise<boolean> {
  try {
    console.log("====== TELEGRAM NOTIFICATION ATTEMPT ======");
    console.log("Config:", JSON.stringify({
      ...config,
      notify_name: config.notify_name,
      telegram_chat_id: config.telegram_chat_id,
      bot_token: config.bot_token ? "[REDACTED]" : undefined,
      enabled: config.enabled
    }, null, 2));
    
    // Use provided credentials
    const chatId = config.telegram_chat_id;
    const botToken = config.bot_token;
    
    if (!chatId || !botToken) {
      console.error("Missing Telegram configuration - Chat ID:", chatId, "Bot token present:", !!botToken);
      toast({
        title: "Configuration Error",
        description: "Missing Telegram chat ID or bot token",
        variant: "destructive"
      });
      return false;
    }

    console.log("Sending Telegram notification to chat ID:", chatId);
    console.log("Bot token available:", !!botToken);
    console.log("Message content:", message);
    
    // Prepare payload for the API call
    const payload = {
      type: "telegram",
      chatId: chatId,
      botToken: botToken,
      message: message
    };
    
    console.log("Prepared payload for notification:", {
      ...payload,
      botToken: "[REDACTED]"
    });
    
    try {
      // Call our client-side API handler
      console.log("Sending request to /api/realtime endpoint");
      const response = await api.handleRequest('/api/realtime', 'POST', payload);

      console.log("API response status:", response.status);
      console.log("API response data:", JSON.stringify(response.json, null, 2));
      
      // Check if response is ok
      if (response.status !== 200) {
        console.error("Error response from notification API:", response.status);
        toast({
          title: "Notification Failed",
          description: `Server returned error ${response.status}: ${response.json?.description || "Unknown error"}`,
          variant: "destructive"
        });
        return false;
      }
      
      const responseData = response.json;
      
      if (responseData && responseData.ok === false) {
        console.error("Error sending notification:", responseData);
        toast({
          title: "Notification Failed",
          description: responseData.description || "Failed to send notification",
          variant: "destructive"
        });
        return false;
      }

      console.log("Notification sent successfully");
      toast({
        title: "Notification Sent",
        description: "Telegram notification sent successfully"
      });
      return true;
    } catch (error) {
      console.error("Error calling notification API:", error);
      toast({
        title: "API Error",
        description: `Failed to communicate with notification service: ${error instanceof Error ? error.message : "Network error"}`,
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error in sendTelegramNotification:", error);
    toast({
      title: "Notification Error",
      description: `Error sending Telegram notification: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive"
    });
    return false;
  }
}