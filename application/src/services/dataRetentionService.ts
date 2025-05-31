
import { pb } from '@/lib/pocketbase';

interface RetentionSettings {
  uptimeRetentionDays: number;
  serverRetentionDays: number;
  lastCleanup?: string;
}

interface CleanupResult {
  deletedRecords: number;
  collections: string[];
}

export const dataRetentionService = {
  async getRetentionSettings(): Promise<RetentionSettings | null> {
    try {
      // Try to get existing settings from data_settings collection
      const records = await pb.collection('data_settings').getFullList({
        sort: '-created'
      });
      
      if (records.length > 0) {
        const settings = records[0];
        return {
          uptimeRetentionDays: settings.uptime_retention_days || 30,
          serverRetentionDays: settings.server_retention_days || 30,
          lastCleanup: settings.last_cleanup
        };
      }
      
      // Return default settings if none exist
      return {
        uptimeRetentionDays: 30,
        serverRetentionDays: 30
      };
    } catch (error) {
      console.error("Error fetching retention settings:", error);
      // Return default settings on error
      return {
        uptimeRetentionDays: 30,
        serverRetentionDays: 30
      };
    }
  },

  async updateRetentionSettings(settings: RetentionSettings): Promise<void> {
    try {
      // Check if settings already exist
      const existingRecords = await pb.collection('data_settings').getFullList({
        sort: '-created'
      });
      
      const data = {
        uptime_retention_days: settings.uptimeRetentionDays,
        server_retention_days: settings.serverRetentionDays,
        retention_days: Math.max(settings.uptimeRetentionDays, settings.serverRetentionDays), // General retention days
        backup: "auto", // Default backup setting
        updated: new Date().toISOString()
      };
      
      if (existingRecords.length > 0) {
        // Update existing record
        await pb.collection('data_settings').update(existingRecords[0].id, data);
      } else {
        // Create new record
        await pb.collection('data_settings').create({
          ...data,
          created: new Date().toISOString()
        });
      }
      
      console.log("Retention settings updated successfully");
    } catch (error) {
      console.error("Error updating retention settings:", error);
      throw new Error("Failed to update retention settings");
    }
  },

  async manualUptimeCleanup(): Promise<CleanupResult> {
    try {
      const settings = await this.getRetentionSettings();
      if (!settings) {
        throw new Error("Could not load retention settings");
      }

      let totalDeleted = 0;
      const cleanedCollections: string[] = [];

      // Calculate cutoff date for uptime data
      const uptimeCutoffDate = new Date();
      uptimeCutoffDate.setDate(uptimeCutoffDate.getDate() - settings.uptimeRetentionDays);

      console.log(`Starting uptime cleanup - Cutoff: ${uptimeCutoffDate.toISOString()}`);

      // Clean uptime_data collection
      try {
        const uptimeRecords = await pb.collection('uptime_data').getFullList({
          filter: `created < "${uptimeCutoffDate.toISOString()}"`
        });
        
        console.log(`Found ${uptimeRecords.length} uptime records to delete`);
        
        for (const record of uptimeRecords) {
          await pb.collection('uptime_data').delete(record.id);
          totalDeleted++;
        }
        
        if (uptimeRecords.length > 0) {
          cleanedCollections.push('uptime_data');
        }
      } catch (error) {
        console.error("Error cleaning uptime_data:", error);
      }

      console.log(`Uptime cleanup completed. Deleted ${totalDeleted} records`);

      return {
        deletedRecords: totalDeleted,
        collections: cleanedCollections
      };
    } catch (error) {
      console.error("Error during uptime cleanup:", error);
      throw new Error("Failed to perform uptime data cleanup");
    }
  },

  async manualServerCleanup(): Promise<CleanupResult> {
    try {
      const settings = await this.getRetentionSettings();
      if (!settings) {
        throw new Error("Could not load retention settings");
      }

      let totalDeleted = 0;
      const cleanedCollections: string[] = [];

      // Calculate cutoff date for server data
      const serverCutoffDate = new Date();
      serverCutoffDate.setDate(serverCutoffDate.getDate() - settings.serverRetentionDays);

      console.log(`Starting server cleanup - Cutoff: ${serverCutoffDate.toISOString()}`);

      // Clean ping_data collection
      try {
        const pingRecords = await pb.collection('ping_data').getFullList({
          filter: `created < "${serverCutoffDate.toISOString()}"`
        });
        
        console.log(`Found ${pingRecords.length} ping records to delete`);
        
        for (const record of pingRecords) {
          await pb.collection('ping_data').delete(record.id);
          totalDeleted++;
        }
        
        if (pingRecords.length > 0) {
          cleanedCollections.push('ping_data');
        }
      } catch (error) {
        console.error("Error cleaning ping_data:", error);
      }

      console.log(`Server cleanup completed. Deleted ${totalDeleted} records`);

      return {
        deletedRecords: totalDeleted,
        collections: cleanedCollections
      };
    } catch (error) {
      console.error("Error during server cleanup:", error);
      throw new Error("Failed to perform server data cleanup");
    }
  },

  async manualCleanup(): Promise<CleanupResult> {
    try {
      // Get current retention settings
      const settings = await this.getRetentionSettings();
      if (!settings) {
        throw new Error("Could not load retention settings");
      }

      let totalDeleted = 0;
      const cleanedCollections: string[] = [];

      // Calculate cutoff dates
      const uptimeCutoffDate = new Date();
      uptimeCutoffDate.setDate(uptimeCutoffDate.getDate() - settings.uptimeRetentionDays);
      
      const serverCutoffDate = new Date();
      serverCutoffDate.setDate(serverCutoffDate.getDate() - settings.serverRetentionDays);

      console.log(`Starting manual cleanup - Uptime cutoff: ${uptimeCutoffDate.toISOString()}, Server cutoff: ${serverCutoffDate.toISOString()}`);

      // Clean uptime_data collection
      try {
        const uptimeRecords = await pb.collection('uptime_data').getFullList({
          filter: `created < "${uptimeCutoffDate.toISOString()}"`
        });
        
        console.log(`Found ${uptimeRecords.length} uptime records to delete`);
        
        for (const record of uptimeRecords) {
          await pb.collection('uptime_data').delete(record.id);
          totalDeleted++;
        }
        
        if (uptimeRecords.length > 0) {
          cleanedCollections.push('uptime_data');
        }
      } catch (error) {
        console.error("Error cleaning uptime_data:", error);
      }

      // Clean ping_data collection
      try {
        const pingRecords = await pb.collection('ping_data').getFullList({
          filter: `created < "${serverCutoffDate.toISOString()}"`
        });
        
        console.log(`Found ${pingRecords.length} ping records to delete`);
        
        for (const record of pingRecords) {
          await pb.collection('ping_data').delete(record.id);
          totalDeleted++;
        }
        
        if (pingRecords.length > 0) {
          cleanedCollections.push('ping_data');
        }
      } catch (error) {
        console.error("Error cleaning ping_data:", error);
      }

      // Update last cleanup timestamp
      await this.updateLastCleanupTime();

      console.log(`Manual cleanup completed. Deleted ${totalDeleted} records from collections: ${cleanedCollections.join(', ')}`);

      return {
        deletedRecords: totalDeleted,
        collections: cleanedCollections
      };
    } catch (error) {
      console.error("Error during manual cleanup:", error);
      throw new Error("Failed to perform database cleanup");
    }
  },

  async updateLastCleanupTime(): Promise<void> {
    try {
      const existingRecords = await pb.collection('data_settings').getFullList({
        sort: '-created'
      });
      
      const data = {
        last_cleanup: new Date().toISOString()
      };
      
      if (existingRecords.length > 0) {
        await pb.collection('data_settings').update(existingRecords[0].id, data);
      }
    } catch (error) {
      console.error("Error updating last cleanup time:", error);
    }
  },

  async scheduleAutomaticCleanup(): Promise<void> {
    try {
      const settings = await this.getRetentionSettings();
      if (!settings) return;

      // Check if enough time has passed since last cleanup (run daily)
      if (settings.lastCleanup) {
        const lastCleanup = new Date(settings.lastCleanup);
        const now = new Date();
        const hoursSinceLastCleanup = (now.getTime() - lastCleanup.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastCleanup < 24) {
          console.log("Skipping automatic cleanup - last cleanup was less than 24 hours ago");
          return;
        }
      }

      console.log("Starting scheduled automatic cleanup");
      const result = await this.manualCleanup();
      console.log(`Automatic cleanup completed. Deleted ${result.deletedRecords} records`);
    } catch (error) {
      console.error("Error during automatic cleanup:", error);
    }
  }
};