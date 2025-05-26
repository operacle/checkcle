import { pb, getCurrentEndpoint } from '@/lib/pocketbase';

const settingsApi = async (body: any) => {
  try {
    const { action, data } = body;
    console.log('Settings API called with action:', action, 'data:', data);

    const authToken = pb.authStore.token;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const baseUrl = getCurrentEndpoint();

    switch (action) {
      case 'getSettings':
        try {
          const response = await fetch(`${baseUrl}/api/settings`, {
            method: 'GET',
            headers,
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const settings = await response.json();
          return {
            status: 200,
            json: { success: true, data: settings },
          };
        } catch (error) {
          console.error('Error fetching settings:', error);
          return {
            status: 500,
            json: { success: false, message: 'Failed to fetch settings' },
          };
        }

      case 'updateSettings':
        try {
          let response = await fetch(`${baseUrl}/api/settings`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
          });

          if (!response.ok && (response.status === 404 || response.status === 405)) {
            response = await fetch(`${baseUrl}/api/settings`, {
              method: 'POST',
              headers,
              body: JSON.stringify(data),
            });
          }

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const updatedSettings = await response.json();
          return {
            status: 200,
            json: { success: true, data: updatedSettings },
          };
        } catch (error) {
          console.error('Error updating settings:', error);
          return {
            status: 500,
            json: { success: false, message: 'Failed to update settings' },
          };
        }

      case 'testEmailConnection':
        try {
          const response = await fetch(`${baseUrl}/api/settings/test-email`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          return {
            status: 200,
            json: {
              success: result.success || false,
              message:
                result.message || (result.success ? 'Connection successful' : 'Connection failed'),
            },
          };
        } catch (error) {
          console.error('Error testing email connection:', error);
          return {
            status: 500,
            json: { success: false, message: 'Failed to test email connection' },
          };
        }

      default:
        return {
          status: 400,
          json: { success: false, message: 'Invalid action' },
        };
    }
  } catch (error) {
    console.error('Unexpected error in settingsApi:', error);
    return {
      status: 500,
      json: { success: false, message: 'Internal server error' },
    };
  }
};

export default settingsApi;