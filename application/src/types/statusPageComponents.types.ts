
export interface StatusPageComponentRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  operational_status_id: string;
  name: string;
  description: string;
  service_id: string;
  server_id: string;
  display_order: number;
  created: string;
  updated: string;
}

export interface StatusPageComponentState {
  data: StatusPageComponentRecord[] | null;
  loading: boolean;
  error: string | null;
}