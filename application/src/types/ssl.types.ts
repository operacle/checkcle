
export interface SSLCertificate {
  id: string;
  domain: string;
  issued_to: string;
  issuer_o: string;
  status: string;
  cert_sans?: string;
  cert_alg?: string;
  serial_number?: number | string;
  valid_from: string;
  valid_till: string;
  validity_days: number;
  days_left: number;
  valid_days_to_expire?: number;
  warning_threshold: number;
  expiry_threshold: number;
  notification_channel: string;
  last_notified?: string;
  created?: string;
  updated?: string;
  // New fields based on the provided structure
  collectionId?: string;
  collectionName?: string;
  resolved_ip?: string;
  issuer_cn?: string;
}

export interface AddSSLCertificateDto {
  domain: string;
  warning_threshold: number;
  expiry_threshold: number;
  notification_channel: string;
}