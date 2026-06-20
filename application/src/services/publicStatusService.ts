
import { pb } from '@/lib/pocketbase';
import { IncidentItem } from './incident/types';
import { MaintenanceItem } from './types/maintenance.types';

/**
 * Read-only data for the public status page.
 *
 * The `incidents` and `maintenance` collections are publicly readable
 * (list/view rules are open), so these queries work without authentication.
 * Records are scoped to the operational page being viewed: either linked to
 * the page directly (`operational_status_id`) or to one of the services shown
 * on that page (`service_id`).
 */

// OR-filter that scopes records to a page and/or its services.
const scopeFilter = (pageId: string, serviceIds: string[]): string => {
  const clauses = [
    `operational_status_id='${pageId}'`,
    ...serviceIds.map((id) => `service_id='${id}'`),
  ];
  return `(${clauses.join(' || ')})`;
};

export const publicStatusService = {
  // Active (not yet resolved) incidents relevant to this page.
  async getActiveIncidents(pageId: string, serviceIds: string[]): Promise<IncidentItem[]> {
    try {
      const filter = `${scopeFilter(pageId, serviceIds)} && impact_status != 'resolved'`;
      const result = await pb.collection('incidents').getList(1, 50, {
        sort: '-timestamp',
        filter,
        requestKey: null,
      });
      return result.items as unknown as IncidentItem[];
    } catch (error) {
      console.error('Error fetching public incidents:', error);
      return [];
    }
  },

  // Scheduled or in-progress maintenance windows for this page.
  async getUpcomingMaintenance(pageId: string): Promise<MaintenanceItem[]> {
    try {
      const filter = `operational_status_id='${pageId}' && (status='scheduled' || status='in_progress')`;
      const result = await pb.collection('maintenance').getList(1, 50, {
        sort: 'start_time',
        filter,
        requestKey: null,
      });
      return result.items as unknown as MaintenanceItem[];
    } catch (error) {
      console.error('Error fetching public maintenance:', error);
      return [];
    }
  },
};
