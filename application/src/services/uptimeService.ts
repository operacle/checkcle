
import { pb } from '@/lib/pocketbase';
import { UptimeData } from '@/types/service.types';

const uptimeCache = new Map<string, {
  data: UptimeData[],
  timestamp: number,
  expiresIn: number
}>();

const CACHE_TTL = 3000; // 3 seconds for faster updates

export const uptimeService = {
  async recordUptimeData(data: UptimeData): Promise<void> {
    try {
      console.log(`Recording uptime data for service ${data.serviceId}: Status ${data.status}, Response time: ${data.responseTime}ms`);
      
      const options = {
        $autoCancel: false,
        $cancelKey: `uptime_record_${data.serviceId}_${Date.now()}`
      };
      
      const record = await pb.collection('uptime_data').create({
        service_id: data.serviceId,
        timestamp: data.timestamp,
        status: data.status,
        response_time: data.responseTime
      }, options);
      
      // Invalidate cache for this service
      const keysToDelete = Array.from(uptimeCache.keys()).filter(key => key.includes(`uptime_${data.serviceId}`));
      keysToDelete.forEach(key => uptimeCache.delete(key));
      
      console.log(`Uptime data recorded successfully with ID: ${record.id}`);
    } catch (error) {
      console.error("Error recording uptime data:", error);
      throw new Error(`Failed to record uptime data: ${error}`);
    }
  },
  
  async getUptimeHistory(
    serviceId: string, 
    limit: number = 200, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<UptimeData[]> {
    try {
      const cacheKey = `uptime_${serviceId}_${limit}_${startDate?.toISOString() || ''}_${endDate?.toISOString() || ''}`;
      
      // Check cache
      const cached = uptimeCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < cached.expiresIn) {
        console.log(`Using cached uptime history for service ${serviceId}`);
        return cached.data;
      }
      
      console.log(`Fetching uptime history for service ${serviceId}, limit: ${limit}`);
      
      let filter = `service_id='${serviceId}'`;
      
      // Add date range filtering if provided
      if (startDate && endDate) {
        // Convert dates to UTC strings in the format PocketBase expects
        const startUTC = startDate.toISOString();
        const endUTC = endDate.toISOString();
        
        console.log(`Date filter: ${startUTC} to ${endUTC}`);
        
        // Use proper PocketBase date filtering syntax
        filter += ` && timestamp >= "${startUTC}" && timestamp <= "${endUTC}"`;
      }
      
      const options = {
        filter: filter,
        sort: '-timestamp',
        $autoCancel: false,
        $cancelKey: `uptime_history_${serviceId}_${Date.now()}`
      };
      
      console.log(`Filter query: ${filter}`);
      
      const response = await pb.collection('uptime_data').getList(1, limit, options);
      
      console.log(`Fetched ${response.items.length} uptime records for service ${serviceId}`);
      
      if (response.items.length > 0) {
        console.log(`Date range in results: ${response.items[response.items.length - 1].timestamp} to ${response.items[0].timestamp}`);
      } else {
        console.log(`No records found for filter: ${filter}`);
        
        // Try a fallback query without date filter to see if there's any data at all
        const fallbackResponse = await pb.collection('uptime_data').getList(1, 10, {
          filter: `service_id='${serviceId}'`,
          sort: '-timestamp',
          $autoCancel: false
        });
        
        console.log(`Fallback query found ${fallbackResponse.items.length} total records for service`);
        if (fallbackResponse.items.length > 0) {
          console.log(`Latest record timestamp: ${fallbackResponse.items[0].timestamp}`);
          console.log(`Oldest record timestamp: ${fallbackResponse.items[fallbackResponse.items.length - 1].timestamp}`);
        }
      }
      
      const uptimeData = response.items.map(item => ({
        id: item.id,
        serviceId: item.service_id,
        timestamp: item.timestamp,
        status: item.status,
        responseTime: item.response_time || 0,
        date: item.timestamp,
        uptime: 100
      }));
      
      // Cache the result
      uptimeCache.set(cacheKey, {
        data: uptimeData,
        timestamp: Date.now(),
        expiresIn: CACHE_TTL
      });
      
      return uptimeData;
    } catch (error) {
      console.error("Error fetching uptime history:", error);
      
      // Try to return cached data as fallback
      const cacheKey = `uptime_${serviceId}_${limit}_${startDate?.toISOString() || ''}_${endDate?.toISOString() || ''}`;
      const cached = uptimeCache.get(cacheKey);
      if (cached) {
        console.log(`Using expired cached data for service ${serviceId} due to fetch error`);
        return cached.data;
      }
      
      throw new Error('Failed to load uptime history.');
    }
  }
};