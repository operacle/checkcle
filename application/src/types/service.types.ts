
export interface Service {
  id: string;
  name: string;
  url: string;
  type: "HTTP" | "HTTPS" | "TCP" | "DNS" | "PING" | "HTTP" | "http" | "https" | "tcp" | "dns" | "ping" | "smtp" | "icmp";
  status: "up" | "down" | "paused" | "pending" | "warning";
  responseTime: number;
  uptime: number;
  lastChecked: string;
  interval: number;
  retries: number;
  notificationChannel?: string;
  alertTemplate?: string;
  muteAlerts?: boolean; // Keep this to avoid breaking existing code
  alerts?: "muted" | "unmuted"; // Make sure alerts is properly typed as union
  muteChangedAt?: string;
}

export interface CreateServiceParams {
  name: string;
  url: string;
  type: string;
  interval: number;
  retries: number;
  notificationChannel?: string;
  alertTemplate?: string;
}

export interface UptimeData {
  date?: string;
  uptime?: number;
  id?: string;
  serviceId?: string;
  timestamp: string;
  status: "up" | "down" | "paused" | "pending" | "warning";
  responseTime: number;
}
