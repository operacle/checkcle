
import { useState, useEffect } from 'react';
import { OperationalPageRecord } from '@/types/operational.types';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { Service, UptimeData } from '@/types/service.types';
import { operationalPageService } from '@/services/operationalPageService';
import { statusPageComponentsService } from '@/services/statusPageComponentsService';
import { serviceService } from '@/services/serviceService';
import { uptimeService } from '@/services/uptimeService';

export const usePublicStatusPageData = (slug: string | undefined) => {
  const [page, setPage] = useState<OperationalPageRecord | null>(null);
  const [components, setComponents] = useState<StatusPageComponentRecord[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [uptimeData, setUptimeData] = useState<Record<string, UptimeData[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicPage = async () => {
      if (!slug) {
        console.log('No slug provided');
        setError('No status page slug provided');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching public status page for slug:', slug);
        setLoading(true);
        setError(null);
        
        // Fetch operational page
        console.log('Fetching operational pages...');
        const pages = await operationalPageService.getOperationalPages();
        console.log('All pages:', pages);
        
        const foundPage = pages.find(p => p.slug === slug && p.is_public === 'true');
        console.log('Found page:', foundPage);
        
        if (!foundPage) {
          console.log('Page not found or not public');
          setError('Status page not found or not public');
          setLoading(false);
          return;
        }
        
        setPage(foundPage);
        console.log('Page set successfully');
        
        // Fetch components for this page
        console.log('Fetching components for page:', foundPage.id);
        const pageComponents = await statusPageComponentsService.getStatusPageComponentsByOperationalId(foundPage.id);
        console.log('Components found:', pageComponents);
        setComponents(pageComponents);
        
        // Fetch all services
        console.log('Fetching all services...');
        const allServices = await serviceService.getServices();
        console.log('Services found:', allServices);
        setServices(allServices);
        
        // Fetch uptime data for each component that has a service
        console.log('Fetching uptime data...');
        const uptimePromises = pageComponents
          .filter(component => component.service_id)
          .map(async (component) => {
            try {
              console.log('Fetching uptime for service:', component.service_id);
              const endDate = new Date();
              const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Last 90 days
              const history = await uptimeService.getUptimeHistory(component.service_id, 2000, startDate, endDate);
              console.log(`Uptime history for ${component.service_id}:`, history.length, 'records');
              return { serviceId: component.service_id, history };
            } catch (error) {
              console.error(`Error fetching uptime for service ${component.service_id}:`, error);
              return { serviceId: component.service_id, history: [] };
            }
          });
        
        const uptimeResults = await Promise.all(uptimePromises);
        const uptimeMap: Record<string, UptimeData[]> = {};
        uptimeResults.forEach(result => {
          uptimeMap[result.serviceId] = result.history;
        });
        setUptimeData(uptimeMap);
        console.log('Uptime data set successfully');
        
        console.log('All data fetched successfully');
        
      } catch (err) {
        console.error('Error fetching public page:', err);
        setError(`Failed to load status page: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPage();
  }, [slug]);

  return {
    page,
    components,
    services,
    uptimeData,
    loading,
    error
  };
};