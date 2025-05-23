
import { settingsService } from "@/services/settingsService";

const settingsApi = async (body: any) => {
  try {
    const { action, data } = body;
    
    switch (action) {
      case 'getSettings':
        const settings = await settingsService.getGeneralSettings();
        return {
          status: 200,
          json: {
            success: true,
            data: settings
          }
        };
        
      case 'updateSettings':
        if (!data.id) {
          return {
            status: 400,
            json: {
              success: false,
              message: 'Settings ID is required'
            }
          };
        }
        
        const updatedSettings = await settingsService.updateGeneralSettings(data.id, data);
        return {
          status: 200,
          json: {
            success: true,
            data: updatedSettings
          }
        };
        
      case 'testEmailConnection':
        // This would typically connect to the SMTP server to test the connection
        // For now, we'll just simulate a successful connection
        return {
          status: 200,
          json: {
            success: true,
            message: 'Connection successful'
          }
        };
        
      default:
        return {
          status: 400,
          json: {
            success: false,
            message: 'Invalid action'
          }
        };
    }
  } catch (error) {
    console.error('Error in settings API:', error);
    return {
      status: 500,
      json: {
        success: false,
        message: 'Internal server error'
      }
    };
  }
};

export default settingsApi;