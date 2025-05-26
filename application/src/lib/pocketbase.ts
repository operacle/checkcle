import PocketBase from 'pocketbase';

// Auto-detect base URL from browser location
const dynamicBaseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:8090';

// Define API endpoints
export const API_ENDPOINTS = {
  REMOTE: dynamicBaseUrl
};

export const getCurrentEndpoint = (): string => {
  if (typeof window !== 'undefined') {
    const savedEndpoint = localStorage.getItem('pocketbase_endpoint');
    return savedEndpoint || API_ENDPOINTS.REMOTE;
  }
  return API_ENDPOINTS.REMOTE;
};

export const setApiEndpoint = (endpoint: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pocketbase_endpoint', endpoint);
    window.location.reload();
  }
};

export const pb = new PocketBase(getCurrentEndpoint());

export const isAuthenticated = () => pb.authStore.isValid;

export const authStore = pb.authStore;

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

  pb.authStore.onChange(() => {
    if (pb.authStore.isValid) {
      localStorage.setItem(
        'pocketbase_auth',
        JSON.stringify({
          token: pb.authStore.token,
          model: pb.authStore.model
        })
      );
    } else {
      localStorage.removeItem('pocketbase_auth');
    }
  });
}
