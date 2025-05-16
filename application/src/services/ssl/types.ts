
// SSL Checker response type
export interface SSLCheckerResponse {
    version: string;
    app: string;
    host: string;
    response_time_sec: string;
    status: string;  // "ok", "error"
    message?: string;
    error?: string;  
    result: {
      host: string;
      resolved_ip?: string;
      issued_to: string;
      issued_o?: string | null;
      issuer_c?: string;
      issuer_o?: string | null;
      issuer_ou?: string | null;
      issuer_cn?: string;
      cert_sn: string;
      cert_sha1?: string;
      cert_alg: string;
      cert_ver?: number;
      cert_sans: string;
      cert_exp?: boolean;
      cert_valid?: boolean;
      valid_from?: string;
      valid_till?: string;
      validity_days?: number;
      days_left?: number;
      valid_days_to_expire?: number;
      hsts_header_enabled?: boolean;
    };
  }
  
  // SSL Certificate DTO for adding new certificates
  export interface AddSSLCertificateDto {
    domain: string;
    warning_threshold: number;
    expiry_threshold: number;
    notification_channel: string;
  }
  
  // SSL Certificate model
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
  }
  
  // SSL specific notification types
  export interface SSLNotification {
    certificateId: string;
    domain: string;
    message: string;
    isCritical: boolean;
    timestamp: string;
  }