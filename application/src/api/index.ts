
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
    } else if (path === '/api/settings') {
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

export default api;