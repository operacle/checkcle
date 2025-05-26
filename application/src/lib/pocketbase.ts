import PocketBase from 'pocketbase';

// Dynamically detect API base URL from current host (for use in browser)
const dynamicBaseUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8090`
    : 'http://localhost:8090';

// Define available API endpoints
export const API_ENDPOINTS = {
  REMOTE: dynamicBaseUrl
};

// Get the current endpoint from localStorage or use remote as default
export const getCurrentEndpoint = (): string => {
  if (typeof window !== 'undefined') {
    const savedEndpoint = localStorage.getItem('pocketbase_endpoint');
    return savedEndpoint || API_ENDPOINTS.REMOTE;
  }
  return API_ENDPOINTS.REMOTE;
};

// Set the API endpoint and reinitialize PocketBase
export const setApiEndpoint = (endpoint: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pocketbase_endpoint', endpoint);
    window.location.reload(); // Reload to reinitialize PocketBase with new endpoint
  }
};

// Initialize the PocketBase client with the current API URL
export const pb = new PocketBase(getCurrentEndpoint());

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Export the auth store for use in components
export const authStore = pb.authStore;

// Configure PocketBase to persist authentication between page reloads
if (typeof window !== 'undefined') {
  const storedAuthData = localStorage.getItem('pocketbase_auth');
  if (storedAuthData) {
    try {
      const parsedData = JSON.parse(storedAuthData);
      pb.authStore.save(parsedData.token, parsedData.model);
    } catch (error) {
      console.error('Failed to parse stored auth data:', error);
      localStorage.removeItem('pocketbase_auth');
    }
  }

  // Subscribe to authStore changes to persist authentication
  pb.authStore.onChange(() => {
    if (pb.authStore.isValid) {
      localStorage.setItem('pocketbase_auth', JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model
      }));
    } else {
      localStorage.removeItem('pocketbase_auth');
    }
  });
}
