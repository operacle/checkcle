import { toast } from "@/hooks/use-toast";
import { AlertConfiguration } from "../alertConfigService";
import api from "@/api";
import { useLanguage } from "@/contexts/LanguageContext";

// 获取当前语言环境
let currentLanguage = "en";
try {
  // 尝试从localStorage获取语言设置
  const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  currentLanguage = storedLanguage || "en";
} catch (e) {
  console.error("Error getting language from localStorage:", e);
}

/**
 * Send a notification via WeCom
 */
export async function sendWecomNotification(
  config: AlertConfiguration, 
  message: string,
  status: string
): Promise<boolean> {
  try {
    console.log("====== WECOM NOTIFICATION ATTEMPT ======");
    console.log("Config:", JSON.stringify({
      ...config,
      notify_name: config.notify_name,
      wecom_webhook_url: config.wecom_webhook_url ? "[REDACTED]" : undefined,
      enabled: config.enabled
    }, null, 2));
    
    // Use provided webhook URL
    const webhookUrl = config.wecom_webhook_url;
    
    if (!webhookUrl) {
      console.error("Missing WeChat Work configuration - Webhook URL:", webhookUrl);
      const isZhCN = currentLanguage === "zh-CN";
      toast({
        title: isZhCN ? "配置错误" : "Configuration Error",
        description: isZhCN ? "缺少企业微信 Webhook URL" : "Missing Wecom webhook URL",
        variant: "destructive"
      });
      return false;
    }

    console.log("Sending WeChat Work notification to webhook URL");
    console.log("Message content:", message);
    
    // Format message for WeChat Work Markdown format
    const formattedMessage = formatWecomMarkdownMessage(message, status);
    
    // Prepare payload for the API call
    const payload = {
      type: "wecom",
      webhookUrl: webhookUrl,
      message: formattedMessage
    };
    
    console.log("Prepared payload for notification:", {
      ...payload,
      webhookUrl: "[REDACTED]"
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
        const isZhCN = currentLanguage === "zh-CN";
        toast({
          title: isZhCN ? "通知失败" : "Notification Failed",
          description: isZhCN 
            ? `服务器返回错误 ${response.status}: ${response.json?.description || "未知错误"}` 
            : `Server returned error ${response.status}: ${response.json?.description || "Unknown error"}`,
          variant: "destructive"
        });
        return false;
      }
      
      const responseData = response.json;
      
      if (responseData && responseData.ok === false) {
        console.error("Error sending notification:", responseData);
        const isZhCN = currentLanguage === "zh-CN";
        toast({
          title: isZhCN ? "通知失败" : "Notification Failed",
          description: responseData.description || (isZhCN ? "发送通知失败" : "Failed to send notification"),
          variant: "destructive"
        });
        return false;
      }

      console.log("Notification sent successfully");
      const isZhCN = currentLanguage === "zh-CN";
      toast({
        title: isZhCN ? "通知已发送" : "Notification Sent",
        description: isZhCN ? "企业微信通知已成功发送" : "Wecom notification sent successfully"
      });
      return true;
    } catch (error) {
      console.error("Error calling notification API:", error);
      const isZhCN = currentLanguage === "zh-CN";
      toast({
        title: isZhCN ? "API 错误" : "API Error",
        description: isZhCN 
          ? `与通知服务通信失败: ${error instanceof Error ? error.message : "网络错误"}` 
          : `Failed to communicate with notification service: ${error instanceof Error ? error.message : "Network error"}`,
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error in sendWecomNotification:", error);
    const isZhCN = currentLanguage === "zh-CN";
    toast({
      title: isZhCN ? "通知错误" : "Notification Error",
      description: isZhCN 
        ? `发送企业微信通知时出错: ${error instanceof Error ? error.message : "未知错误"}` 
        : `Error sending Wecom notification: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Format a message for WeChat Work Markdown format
 * 
 * @param message The original message
 * @param status The service status (up, down, warning, etc.)
 * @returns Formatted markdown message for WeChat Work
 */
function formatWecomMarkdownMessage(message: string, status: string): string {
  // Replace newlines with markdown line breaks
  let formattedMessage = message.replace(/\n/g, '\n');
  
  // Extract service name and other details for better formatting
  const serviceNameMatch = message.match(/Service ([^\s]+) is/);
  const serviceName = serviceNameMatch ? serviceNameMatch[1] : "Unknown";
  
  // Extract response time if available
  const responseTimeMatch = message.match(/Response time: ([\d.]+)ms/);
  const responseTime = responseTimeMatch ? responseTimeMatch[1] + "ms" : "N/A";
  
  // Extract URL if available
  const urlMatch = message.match(/URL: ([^\s\n]+)/);
  const url = urlMatch ? urlMatch[1] : "N/A";
  
  // Format the message with markdown based on language
  const isZhCN = currentLanguage === "zh-CN";
  
  const markdownMessage = {
    msgtype: "markdown",
    markdown: {
      content: `## <font color=\"${getStatusColor(status)}\">${isZhCN ? "服务状态通知" : "Service Status Notification"}</font>\n\n` +
               `**${isZhCN ? "服务名称" : "Service Name"}**: ${serviceName}\n` +
               `**${isZhCN ? "当前状态" : "Current Status"}**: <font color=\"${getStatusColor(status)}\">${status.toUpperCase()}</font>\n` +
               `**${isZhCN ? "响应时间" : "Response Time"}**: **${responseTime}**\n` +
               `**URL**: **${url}**\n` +
               `**${isZhCN ? "详细信息" : "Details"}**: ${formattedMessage}\n` +
               `**${isZhCN ? "通知时间" : "Notification Time"}**: **${new Date().toLocaleString()}**`
    }
  };
  
  return JSON.stringify(markdownMessage);
}

/**
 * Get color code based on status
 * 根据用户要求，状态信息根据事件级别用红、绿、蓝三种颜色表示
 */
function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower === "up" || statusLower === "resolved" || statusLower === "ok" || statusLower === "operational") {
    return "green"; // 绿色表示正常状态
  } else if (statusLower === "down" || statusLower === "error" || statusLower === "critical") {
    return "red"; // 红色表示错误或严重问题
  } else if (statusLower === "warning" || statusLower === "degraded" || statusLower === "maintenance" || statusLower === "paused") {
    return "blue"; // 蓝色表示警告或降级状态
  } else {
    return "gray"; // 灰色表示其他状态
  }
}

/**
 * Test sending a WeChat Work notification
 * This function is used for testing the WeChat Work notification configuration
 * 
 * @param config The alert configuration containing WeChat Work webhook URL
 * @param serviceName The name of the service to include in the test message
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function testSendWecomMessage(
  config: AlertConfiguration,
  serviceName: string = "Test Service"
): Promise<boolean> {
  try {
    console.log("====== TEST WECOM NOTIFICATION ======");
    console.log("Sending test notification to WeChat Work");
    
    // Create a test message based on language
    const isZhCN = currentLanguage === "zh-CN";
    const testMessage = isZhCN
      ? `🧪 这是一条测试消息\nService ${serviceName} is UP\nResponse time: 123ms\nURL: https://example.com\n\n此消息仅用于测试企业微信通知配置。`
      : `🧪 This is a test message\nService ${serviceName} is UP\nResponse time: 123ms\nURL: https://example.com\n\nThis message is only for testing Wecom notification configuration.`;
    
    // Send the notification with "up" status for testing
    return await sendWecomNotification(config, testMessage, "up");
  } catch (error) {
    console.error("Error in testSendWecomMessage:", error);
    const isZhCN = currentLanguage === "zh-CN";
    toast({
      title: isZhCN ? "测试通知失败" : "Test Notification Failed",
      description: isZhCN
        ? `发送企业微信测试通知时出错: ${error instanceof Error ? error.message : "未知错误"}`
        : `Error sending Wecom test notification: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive"
    });
    return false;
  }
}