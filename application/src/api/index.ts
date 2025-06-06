
// API routes handler
import realtime from './realtime';
import settingsApi from './settings';

/**
 * Simple API router for client-side application
 */
const api = {
  /**
   * Handle API requests
   */
  async handleRequest(path, method, body) {
    console.log(`API request: ${method} ${path}`, body);
    
    // Route to the appropriate handler
    if (path === '/api/realtime') {
      console.log("Routing to realtime handler");
      return await realtime(body);
    } else if (path === '/api/settings' || path.startsWith('/api/settings/')) {
      console.log("Routing to settings handler");
      return await settingsApi(body);
    }
    
    // Return 404 for unknown routes
    console.error(`Endpoint not found: ${path}`);
    return {
      status: 404,
      json: {
        ok: false,
        error_code: 404,
        description: "Endpoint not found"
      }
    };
  }
};

// Mock fetch override for development
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  // Check if this is an API request to our mock endpoints
  if (typeof url === 'string' && url.startsWith('/api/')) {
    console.log('Intercepting API request:', url, options);
    
    try {
      let body = {};
      
      // Properly handle different body types
      if (options.body) {
        if (typeof options.body === 'string') {
          body = JSON.parse(options.body);
        } else {
          // Handle ReadableStream or other BodyInit types
          const bodyText = await new Response(options.body).text();
          body = bodyText ? JSON.parse(bodyText) : {};
        }
      }
      
      const result = await api.handleRequest(url, options.method || 'GET', body);
      
      // Create a proper Response object
      return new Response(JSON.stringify(result.json), {
        status: result.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error in API handler:', error);
      return new Response(JSON.stringify({
        success: false,
        message: 'Internal server error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch(url, options);
};

export default api;