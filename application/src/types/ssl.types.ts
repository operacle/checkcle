
export interface SSLCertificate {
    id: string;
    domain: string;
    issuer: string;
    expiration_date: string;
    status: string;
    last_notified: string;
    warning_threshold: number;
    expiry_threshold: number;
    notification_channel: string;
    created: string;
    updated: string;
  }