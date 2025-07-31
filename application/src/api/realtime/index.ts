
// This file handles realtime notifications in a client-side environment
// In a production app, this would be a server-side endpoint

//console.log("API Realtime endpoint loaded");

// Simple implementation that simulates sending notifications
export default async function handler(req) {
  try {
    console.log("Realtime API call received:", JSON.stringify({
      ...req,
      botToken: req?.botToken ? "[REDACTED]" : undefined
    }, null, 2));
    
    // Make sure we're accessing the body correctly
    const body = req || {};
    const { type } = body;
    
    if (!type) {
      console.error("Missing notification type parameter");
      return {
        status: 400,
        json: {
          ok: false,
          error_code: 400,
          description: "Missing notification type"
        }
      };
    }
    
    // Handle Telegram notifications
    if (type === "telegram") {
      const { chatId, botToken, message } = body;
      
      console.log("Telegram notification request details:");
      console.log("- Chat ID:", chatId);
      console.log("- Bot token available:", !!botToken);
      console.log("- Message length:", message?.length || 0);
      
      if (!chatId || !botToken || !message) {
        console.error("Missing required parameters for Telegram notification", { 
          hasChatId: !!chatId, 
          hasBotToken: !!botToken, 
          hasMessage: !!message 
        });
        
        return {
          status: 400,
          json: {
            ok: false,
            error_code: 400,
            description: "Missing required Telegram parameters"
          }
        };
      }
      
      try {
        console.log("Attempting to call real Telegram API");
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        console.log("Calling Telegram API:", telegramApiUrl.replace(botToken, "[REDACTED]"));
        
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Telegram API error (${response.status}):`, errorText);
          
          try {
            // Try to parse error as JSON if possible
            const errorJson = JSON.parse(errorText);
            return {
              status: response.status,
              json: errorJson
            };
          } catch (e) {
            // If parsing fails, return the raw error
            return {
              status: response.status,
              json: {
                ok: false,
                error_code: response.status,
                description: `Telegram API error: ${errorText}`
              }
            };
          }
        }
        
        const result = await response.json();
        console.log("Telegram API response:", JSON.stringify(result, null, 2));
        
        if (!result.ok) {
          console.error("Telegram API error:", result);
          return {
            status: response.status,
            json: result
          };
        }
        
        console.log("Successfully sent message to Telegram!");
        return {
          status: 200,
          json: {
            ok: true,
            result: result.result,
            description: "Message sent successfully to Telegram"
          }
        };
      } catch (error) {
        console.error("Error calling Telegram API:", error);
        
        // Return detailed error information
        return {
          status: 500,
          json: {
            ok: false,
            error_code: 500,
            description: `Error sending Telegram message: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        };
      }
    } 
    // Handle Signal notifications
    else if (type === "signal") {
      const { signalNumber, message } = body;
      
      if (!signalNumber || !message) {
        console.error("Missing required parameters for Signal notification", { 
          hasSignalNumber: !!signalNumber, 
          hasMessage: !!message 
        });
        
        return {
          status: 400,
          json: {
            ok: false,
            error_code: 400,
            description: "Missing required Signal parameters"
          }
        };
      }
      
      // Simulate sending Signal message
      console.log(`[SIMULATION] Sending Signal message to ${signalNumber}: ${message}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return success response
      return {
        status: 200,
        json: {
          ok: true,
          result: {
            id: Math.floor(Math.random() * 10000),
            timestamp: Date.now(),
            delivered: true
          },
          description: "Signal message sent successfully (simulated)"
        }
      };
    } 
    // Handle WeChat Work (WeCom) notifications
    else if (type === "wecom") {
      const { webhookUrl, message } = body;
      
      if (!webhookUrl || !message) {
        console.error("Missing required parameters for WeChat Work notification", { 
          hasWebhookUrl: !!webhookUrl, 
          hasMessage: !!message 
        });
        
        return {
          status: 400,
          json: {
            ok: false,
            error_code: 400,
            description: "Missing required WeChat Work parameters"
          }
        };
      }
      
      try {
        console.log("Attempting to call WeChat Work webhook API");
        console.log("Calling WeChat Work webhook URL: [REDACTED]");
        
        // Parse the message to get the JSON payload
        let messagePayload;
        try {
          messagePayload = JSON.parse(message);
        } catch (e) {
          console.error("Error parsing WeChat Work message payload:", e);
          return {
            status: 400,
            json: {
              ok: false,
              error_code: 400,
              description: "Invalid WeChat Work message format"
            }
          };
        }
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messagePayload),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`WeChat Work API error (${response.status}):`, errorText);
          
          try {
            // Try to parse error as JSON if possible
            const errorJson = JSON.parse(errorText);
            return {
              status: response.status,
              json: errorJson
            };
          } catch (e) {
            // If parsing fails, return the raw error
            return {
              status: response.status,
              json: {
                ok: false,
                error_code: response.status,
                description: `WeChat Work API error: ${errorText}`
              }
            };
          }
        }
        
        const result = await response.json();
        console.log("WeChat Work API response:", JSON.stringify(result, null, 2));
        
        // WeChat Work API returns errcode: 0 for success
        if (result.errcode !== 0) {
          console.error("WeChat Work API error:", result);
          return {
            status: 400,
            json: {
              ok: false,
              error_code: result.errcode,
              description: result.errmsg || "Unknown WeChat Work API error"
            }
          };
        }
        
        console.log("Successfully sent message to WeChat Work!");
        return {
          status: 200,
          json: {
            ok: true,
            result: result,
            description: "Message sent successfully to WeChat Work"
          }
        };
      } catch (error) {
        console.error("Error calling WeChat Work API:", error);
        
        // Return detailed error information
        return {
          status: 500,
          json: {
            ok: false,
            error_code: 500,
            description: `Error sending WeChat Work message: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        };
      }
    } else {
      // Return error for unsupported notification type
      console.error("Unsupported notification type:", type);
      return {
        status: 400,
        json: {
          ok: false,
          error_code: 400,
          description: `Unsupported notification type: ${type}`
        }
      };
    }
  } catch (error) {
    console.error("Error in realtime handler:", error);
    return {
      status: 500,
      json: {
        ok: false,
        error_code: 500,
        description: error.message || "Internal server error"
      }
    };
  }
}
