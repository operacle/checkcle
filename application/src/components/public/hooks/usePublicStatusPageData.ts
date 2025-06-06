
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
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch operational page
        const pages = await operationalPageService.getOperationalPages();
        const foundPage = pages.find(p => p.slug === slug && p.is_public === 'true');
        
        if (!foundPage) {
          setError('Status page not found or not public');
          return;
        }
        
        setPage(foundPage);
        
        // Fetch components for this page
        const pageComponents = await statusPageComponentsService.getStatusPageComponentsByOperationalId(foundPage.id);
        setComponents(pageComponents);
        
        // Fetch all services
        const allServices = await serviceService.getServices();
        setServices(allServices);
        
        // Fetch uptime data for each component that has a service
        const uptimePromises = pageComponents
          .filter(component => component.service_id)
          .map(async (component) => {
            try {
              const endDate = new Date();
              const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Last 90 days
              const history = await uptimeService.getUptimeHistory(component.service_id, 2000, startDate, endDate);
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
        
      } catch (err) {
        console.error('Error fetching public page:', err);
        setError('Failed to load status page');
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