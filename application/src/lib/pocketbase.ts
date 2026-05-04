import PocketBase, { BaseAuthStore } from 'pocketbase';

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

// Initialize the PocketBase client with an in-memory auth store so auth tokens
// are not persisted in localStorage where XSS can trivially exfiltrate them.
export const pb = new PocketBase(getCurrentEndpoint(), new BaseAuthStore());

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Export the auth store for use in components
export const authStore = pb.authStore;

// Remove any auth tokens that may have been persisted by earlier versions.
if (typeof window !== 'undefined') {
  localStorage.removeItem('pocketbase_auth');
}
