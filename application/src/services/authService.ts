
import { pb } from '@/lib/pocketbase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      return {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.full_name || authData.record.name,
        avatar: authData.record.avatar
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    }
  },

  logout(): void {
    pb.authStore.clear();
  },

  getCurrentUser(): AuthUser | null {
    if (!pb.authStore.isValid) {
      return null;
    }
    
    const userData = pb.authStore.model as any;
    
    if (!userData) return null;
    
    // Log the full user data for debugging
    console.log("Raw user data from authStore:", userData);
    
    // The avatar will be kept as is - either the full path from Pocketbase
    // or we'll handle display in the UI components
    return { 
      id: userData.id, 
      email: userData.email, 
      name: userData.full_name || userData.name, 
      avatar: userData.avatar 
    };
  },

  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },
  
  // New method to refresh user data after updates
  async refreshUserData(): Promise<void> {
    if (!pb.authStore.isValid || !pb.authStore.model) return;
    
    try {
      // Fetch the latest user data from the server
      const userId = (pb.authStore.model as any).id;
      await pb.collection('users').getOne(userId);
      // PocketBase will automatically update the authStore
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }
};
