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
  status?: string; // Added this field to support the backend status
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
      
      // Handle email updates separately using the request-email-change endpoint
      const hasEmailChange = cleanData.email !== undefined;
      const emailToUpdate = hasEmailChange ? cleanData.email : null;
      
      // Remove email from regular update if it's being changed
      if (hasEmailChange) {
        console.log("Email change detected, will handle separately:", emailToUpdate);
        delete cleanData.email;
        delete cleanData.emailVisibility; // Don't set this yet, it will be set after email change
      }
      
      let updatedUser: User | null = null;
      
      // Only perform the regular update if there are fields to update
      if (Object.keys(cleanData).length > 0) {
        console.log("Final update payload to PocketBase:", cleanData);
        
        // Use the direct API approach for more control over the update process
        const apiUrl = `${pb.baseUrl}/api/collections/users/records/${id}`;
        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': pb.authStore.token
          },
          body: JSON.stringify(cleanData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("PocketBase API error:", errorData);
          throw new Error(errorData.message || "Failed to update user");
        }
        
        updatedUser = await response.json() as unknown as User;
        console.log("PocketBase update response for regular fields:", updatedUser);
      } else {
        // If no other fields to update, get the current user
        updatedUser = await this.getUser(id);
      }
      
      // Now handle email change separately if needed
      if (emailToUpdate) {
        try {
          console.log("Processing email change request for new email:", emailToUpdate);
          // Use the request-email-change endpoint directly
          const emailChangeUrl = `${pb.baseUrl}/api/collections/users/request-email-change`;
          const emailChangeResponse = await fetch(emailChangeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': pb.authStore.token
            },
            body: JSON.stringify({
              newEmail: emailToUpdate
            })
          });
          
          if (!emailChangeResponse.ok) {
            const errorData = await emailChangeResponse.json();
            console.error("Email change request failed:", errorData);
            throw new Error(errorData.message || "Failed to request email change");
          }
          
          console.log("Email change request sent successfully");
          // The email won't be updated immediately as verification is required
          // We'll return the current user data, and email will be updated after verification
        } catch (error) {
          console.error("Failed to request email change:", error);
          // Continue with the function and return updated user for the fields that were updated
          // We don't throw here because we want to save the other fields even if email change fails
        }
      }
      
      return updatedUser;
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