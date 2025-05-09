
import { pb } from "@/lib/pocketbase";

export interface User {
  id: string;
  created: string;
  updated: string;
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  full_name?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  full_name?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  emailVisibility?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  emailVisibility?: boolean;
  full_name?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

export const userService = {
  async getUsers(): Promise<User[] | null> {
    try {
      console.log("Calling getUsers API");
      const result = await pb.collection('users').getList(1, 50, {
        sort: 'created',
      });
      
      console.log("Users API response:", result);
      
      if (result.items.length > 0) {
        return result.items as unknown as User[];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return null;
    }
  },
  
  async getUser(id: string): Promise<User | null> {
    try {
      console.log(`Fetching user with ID: ${id}`);
      const result = await pb.collection('users').getOne(id);
      console.log("User fetch result:", result);
      return result as unknown as User;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      return null;
    }
  },
  
  async updateUser(id: string, data: UpdateUserData): Promise<User | null> {
    try {
      // Create a clean update object - remove undefined and empty string values
      const cleanData: Record<string, any> = {};
      Object.entries(data).forEach(([key, value]) => {
        // Skip undefined values and empty strings for non-required fields
        if (value !== undefined && !(typeof value === 'string' && value.trim() === '')) {
          cleanData[key] = value;
        }
      });
      
      console.log("Updating user with clean data:", cleanData);
      
      // If there's nothing to update, return the current user
      if (Object.keys(cleanData).length === 0) {
        console.log("No changes to update");
        const currentUser = await this.getUser(id);
        return currentUser;
      }
      
      // Important fix: Don't send avatar field if it's a local path
      // PocketBase API doesn't accept local file paths as valid files
      if (cleanData.avatar && typeof cleanData.avatar === 'string' && cleanData.avatar.startsWith('/upload/profile/')) {
        console.log("Removing local avatar path from update data");
        delete cleanData.avatar;
      }
      
      // Use the PocketBase API to update the user
      const result = await pb.collection('users').update(id, cleanData);
      console.log("Update result:", result);
      return result as unknown as User;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error; // Re-throw to handle in the component
    }
  },
  
  async deleteUser(id: string): Promise<boolean> {
    try {
      await pb.collection('users').delete(id);
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  },

  async createUser(data: CreateUserData): Promise<User | null> {
    try {
      // Handle the avatar field for static files
      if (data.avatar && typeof data.avatar === 'string' && data.avatar.startsWith('/upload/profile/')) {
        // Remove avatar field for new users if it's a local path
        // PocketBase requires actual file uploads, not paths
        console.log("Removing local avatar path for new user");
        delete data.avatar;
      }
      
      const result = await pb.collection('users').create(data);
      return result as unknown as User;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }
};
