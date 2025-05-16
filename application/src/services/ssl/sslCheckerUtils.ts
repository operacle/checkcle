
/**
 * Normalize domain by removing protocol if present
 */
export const normalizeDomain = (domain: string): string => {
    if (!domain) return '';
    
    // Remove any protocol (http://, https://)
    return domain.replace(/^(https?:\/\/)/, '').trim();
  };
  
  /**
   * Create error response for SSL check failures
   */
  export const createErrorResponse = (domain: string, error: unknown): any => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown SSL check error';
    
    const errorResponse = {
      version: "1.0",
      app: "ssl-checker",
      host: domain,
      response_time_sec: "0",
      status: "error",
      message: errorMessage,
      error: errorMessage,
      result: {
        host: domain,
        resolved_ip: domain,
        issued_to: domain,
        issued_o: null,
        issuer_c: "Unknown",
        issuer_o: "Unknown",
        issuer_ou: null,
        issuer_cn: "Unknown",
        cert_sn: "Unknown",
        cert_sha1: "",
        cert_alg: "Unknown",
        cert_ver: 0,
        cert_sans: domain,
        cert_exp: true,
        cert_valid: false,
        valid_from: "Unknown",
        valid_till: "Unknown",
        validity_days: 0,
        days_left: 0,
        valid_days_to_expire: 0,
        hsts_header_enabled: false
      }
    };
    
    return errorResponse;
  };