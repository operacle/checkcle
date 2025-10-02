
import { pb } from "@/lib/pocketbase";

export interface ServerThreshold {
  id: string;
  name: string;
  cpu_threshold: number;
  ram_threshold: number;
  // Some API responses may use a different field name; include it as optional
  ram_threshold_message?: number;
  disk_threshold: number;
  network_threshold: number;
  created: string;
  updated: string;
}

export interface CreateUpdateServerThresholdData {
  name: string;
  cpu_threshold: number;
  ram_threshold: number;
  disk_threshold: number;
  network_threshold: number;
}

export const serverThresholdService = {
  async getServerThresholds(): Promise<ServerThreshold[]> {
    try {
    //  console.log("Fetching server threshold templates");
      const response = await pb.collection('server_threshold_templates').getList(1, 50, {
        sort: '-created',
      });
    //  console.log("Server threshold templates response:", response);
      return response.items as unknown as ServerThreshold[];
    } catch (error) {
    //  console.error("Error fetching server threshold templates:", error);
      throw error;
    }
  },

  async getServerThreshold(id: string): Promise<ServerThreshold> {
    try {
    //  console.log(`Fetching server threshold template with id: ${id}`);
      const response = await pb.collection('server_threshold_templates').getOne(id);
    //  console.log("Server threshold template response:", response);
      return response as unknown as ServerThreshold;
    } catch (error) {
    //  console.error(`Error fetching server threshold template with id ${id}:`, error);
      throw error;
    }
  },

  async createServerThreshold(data: CreateUpdateServerThresholdData): Promise<ServerThreshold> {
    try {
     // console.log("Creating new server threshold template with data:", data);
      const response = await pb.collection('server_threshold_templates').create(data);
    //  console.log("Create server threshold template response:", response);
      return response as unknown as ServerThreshold;
    } catch (error) {
    //  console.error("Error creating server threshold template:", error);
      throw error;
    }
  },

  async updateServerThreshold(id: string, data: Partial<CreateUpdateServerThresholdData>): Promise<ServerThreshold> {
    try {
    //  console.log(`Updating server threshold template with id: ${id}`, data);
      const response = await pb.collection('server_threshold_templates').update(id, data);
    //  console.log("Update server threshold template response:", response);
      return response as unknown as ServerThreshold;
    } catch (error) {
    //  console.error(`Error updating server threshold template with id ${id}:`, error);
      throw error;
    }
  },

  async deleteServerThreshold(id: string): Promise<boolean> {
    try {
    //  console.log(`Deleting server threshold template with id: ${id}`);
      await pb.collection('server_threshold_templates').delete(id);
    //  console.log("Server threshold template deleted successfully");
      return true;
    } catch (error) {
    //  console.error(`Error deleting server threshold template with id ${id}:`, error);
      throw error;
    }
  }
};