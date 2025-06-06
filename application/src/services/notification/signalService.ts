
import { toast } from "@/hooks/use-toast";
import { AlertConfiguration } from "../alertConfigService";
import api from "@/api";

/**
 * Send a notification via Signal
 */
export async function sendSignalNotification(
  config: AlertConfiguration, 
  message: string
): Promise<boolean> {
  try {
    if (!config.signal_number) {
      console.log("Missing Signal configuration - Signal number:", config.signal_number);
      toast({
        title: "Configuration Error",
        description: "Missing Signal number",
        variant: "destructive"
      });
      return false;
    }

    console.log("Sending Signal notification to number:", config.signal_number);
    console.log("Message content:", message);
    
    // Prepare payload for the API call
    const payload = {
      type: "signal",
      signalNumber: config.signal_number,
      message: message
    };
    
    console.log("Prepared payload for Signal notification:", payload);
    
    try {
      // Call our client-side API handler
      console.log("Sending request to /api/realtime endpoint for Signal");
      const response = await api.handleRequest('/api/realtime', 'POST', payload);

      console.log("API response status:", response.status);
      
      // Check if response is ok
      if (response.status !== 200) {
        console.error("Error response from Signal notification API:", response.status);
        toast({
          title: "Notification Failed",
          description: `Server returned error ${response.status}`,
          variant: "destructive"
        });
        return false;
      }
      
      const responseData = response.json;
      console.log("API response data:", responseData);
      
      if (responseData && responseData.ok === false) {
        console.error("Error sending Signal notification:", responseData);
        toast({
          title: "Notification Failed",
          description: responseData.description || "Failed to send Signal notification",
          variant: "destructive"
        });
        return false;
      }

      console.log("Signal notification sent successfully");
      toast({
        title: "Notification Sent",
        description: "Signal notification sent successfully"
      });
      return true;
    } catch (error) {
      console.error("Error calling Signal notification API:", error);
      toast({
        title: "API Error",
        description: `Failed to communicate with Signal notification service: ${error instanceof Error ? error.message : "Network error"}`,
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error in sendSignalNotification:", error);
    toast({
      title: "Notification Error",
      description: `Error sending Signal notification: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive"
    });
    return false;
  }
}