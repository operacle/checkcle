
export interface OperationalPageRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  title: string;
  description: string;
  is_public: string;
  slug: string;
  theme: string;
  logo_url: string;
  custom_domain: string;
  custom_css: string;
  page_style: string;
  status: 'operational' | 'degraded' | 'maintenance' | 'major_outage';
  created: string;
  updated: string;
}

export interface OperationalPageState {
  data: OperationalPageRecord | null;
  loading: boolean;
  error: string | null;
}