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

// Helper function to convert PocketBase record to User type
const convertToUserType = (record: any, role: string = "admin"): User => {
  return {
    id: record.id,
    created: record.created,
    updated: record.updated,
    username: record.username,
    email: record.email,
    emailVisibility: record.emailVisibility,
    verified: record.verified,
    full_name: record.full_name,
    avatar: record.avatar,
    role: role,
    isActive: record.isActive,
    status: record.status,
  };
};

export const userService = {
  async getUsers(): Promise<User[] | null> {
    try {
      console.log("Calling getUsers API");
      
      // Get both regular users and superadmins
      const regularUsers = await pb.collection('users').getList(1, 50, {
        sort: 'created',
      });
      
      let superadminUsers: any = [];
      try {
        // Try to get superadmin users if exists
        superadminUsers = await pb.collection('_superusers').getList(1, 50, {
          sort: 'created',
        });
        console.log("Successfully fetched superadmin users:", superadminUsers);
      } catch (error) {
        console.log("No superadmin collection or access rights:", error);
      }
      
      // Combine both user types and mark superadmins
      const allUsers = [
        ...regularUsers.items.map((user: any) => convertToUserType(user, user.role || "admin")),
        ...superadminUsers.items.map((user: any) => convertToUserType(user, "superadmin"))
      ];
      
      console.log("Combined users list:", allUsers);
      
      return allUsers;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return null;
    }
  },
  
  async getUser(id: string): Promise<User | null> {
    try {
      console.log(`Fetching user with ID: ${id}`);
      
      // Try fetching from regular users first
      try {
        const user = await pb.collection('users').getOne(id);
        console.log("User fetch result (regular user):", user);
        return convertToUserType(user, user.role || "admin");
      } catch (error) {
        console.log("User not found in regular users, trying superadmin collection");
      }
      
      // If not found, try in superadmins
      try {
        const user = await pb.collection('_superusers').getOne(id);
        console.log("User fetch result (superadmin):", user);
        return convertToUserType(user, "superadmin");
      } catch (error) {
        console.log("User not found in superadmin collection either");
        return null;
      }
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
      
      // Special handling for role changes between admin and superadmin
      const roleChange = cleanData.role !== undefined;
      const targetRole = roleChange ? cleanData.role : null;
      
      // Remove role from regular update if it's being changed
      if (roleChange) {
        delete cleanData.role;
      }

      // Handle email updates with proper error handling
      const hasEmailChange = cleanData.email !== undefined;
      const emailToUpdate = hasEmailChange ? cleanData.email : null;
      
      let updatedUser: User | null = null;
      
      // First, determine if this is currently a regular user or superadmin
      let isCurrentlySuperadmin = false;
      try {
        await pb.collection('_superusers').getOne(id);
        isCurrentlySuperadmin = true;
      } catch (error) {
        // Not in superadmin collection
      }
      
      // If we're changing the role and need to move the user between collections
      if (roleChange && ((isCurrentlySuperadmin && targetRole !== "superadmin") || 
                         (!isCurrentlySuperadmin && targetRole === "superadmin"))) {
        // Get the full user data before changing collections
        const currentUser = await this.getUser(id);
        if (!currentUser) {
          throw new Error("User not found during role change");
        }
        
        // Prepare user data for transfer
        const transferData = {
          username: currentUser.username,
          email: currentUser.email,
          emailVisibility: currentUser.emailVisibility || true,
          full_name: currentUser.full_name || "",
          avatar: currentUser.avatar || "",
          isActive: currentUser.isActive !== false,
          ...cleanData
        };
        
        try {
          if (targetRole === "superadmin") {
            // Create in superadmin collection
            const newSuperUser = await pb.collection('_superusers').create(transferData);
            // Delete from regular users
            await pb.collection('users').delete(id);
            updatedUser = convertToUserType(newSuperUser, "superadmin");
          } else {
            // Create in regular users collection
            const newRegularUser = await pb.collection('users').create(transferData);
            // Delete from superadmin
            await pb.collection('_superusers').delete(id);
            updatedUser = convertToUserType(newRegularUser, "admin");
          }
          console.log("User transferred between collections due to role change");
          
        } catch (error) {
          console.error("Failed to transfer user between collections:", error);
          throw new Error("Failed to change user role: " + (error instanceof Error ? error.message : "Unknown error"));
        }
      } else {
        // Regular update without changing collections
        if (Object.keys(cleanData).length > 0) {
          console.log("Final update payload to PocketBase:", cleanData);
          
          try {
            // Use the appropriate collection
            const collection = isCurrentlySuperadmin ? '_superusers' : 'users';
            const updatedRecord = await pb.collection(collection).update(id, cleanData);
            updatedUser = convertToUserType(updatedRecord, isCurrentlySuperadmin ? "superadmin" : "admin");
            
            console.log("PocketBase update response:", updatedUser);
            
            // If email was updated successfully, show success message
            if (hasEmailChange) {
              console.log("Email updated successfully to:", emailToUpdate);
            }
            
          } catch (error) {
            console.error("Error updating user:", error);
            
            // Provide more specific error messages for email issues
            if (hasEmailChange && error instanceof Error) {
              if (error.message.includes("email")) {
                throw new Error("Email update failed. The email address may already be in use or invalid.");
              }
            }
            
            throw error;
          }
        } else {
          // If no fields to update, get the current user
          updatedUser = await this.getUser(id);
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
      // Try to delete from regular users first
      try {
        await pb.collection('users').delete(id);
        return true;
      } catch (error) {
        console.log("User not found in regular users, trying superadmin collection");
      }
      
      // If not found, try deleting from superadmin collection
      try {
        await pb.collection('_superusers').delete(id);
        return true;
      } catch (error) {
        console.error("Failed to delete user from either collection:", error);
        return false;
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  },

  async createUser(data: CreateUserData): Promise<User | null> {
    try {
      // Create a clean data object without avatar field if it's a URL
      // PocketBase requires actual file uploads for avatar, not URLs
      const cleanData = { ...data };
      
      // Remove avatar if it's a URL (we'll handle this differently in the future)
      if (cleanData.avatar && typeof cleanData.avatar === 'string') {
        // Check if it's an external URL (not a file reference)
        if (cleanData.avatar.startsWith('http') || 
            cleanData.avatar.startsWith('/upload/') ||
            cleanData.avatar.includes('api.dicebear.com')) {
          console.log("Removing avatar URL for new user creation:", cleanData.avatar);
          delete cleanData.avatar;
        }
      }
      
      // Determine which collection to use based on the role
      const isSuperAdmin = cleanData.role === "superadmin";
      const collection = isSuperAdmin ? '_superusers' : 'users';
      
      console.log(`Creating new user in ${collection} collection with data:`, {
        ...cleanData,
        password: "[REDACTED]",
        passwordConfirm: "[REDACTED]"
      });
      
      // Create the user in the appropriate collection
      const result = await pb.collection(collection).create(cleanData);
      
      return convertToUserType(result, isSuperAdmin ? "superadmin" : "admin");
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }
};