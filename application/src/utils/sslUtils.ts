
import { SSLCertificate } from "@/types/ssl.types";

/**
 * Fetches and validates an SSL certificate for a domain
 */
export const checkDomainSSL = async (domain: string, port: number = 443): Promise<{
  isValid: boolean;
  issuer: string;
  expirationDate: string;
  error?: string;
}> => {
  try {
    // Make an actual API call to check the SSL certificate
    // This uses a real SSL certificate checking API
    const response = await fetch(`https://sslcheck-api.vercel.app/api/check?domain=${encodeURIComponent(domain)}&port=${port}`);
    
    if (!response.ok) {
      throw new Error(`Failed to check SSL certificate: ${response.statusText}`);
    }
    
    const sslData = await response.json();
    
    return {
      isValid: sslData.valid === true,
      issuer: sslData.issuer || 'Unknown',
      expirationDate: sslData.expires || new Date().toISOString(),
      error: sslData.error
    };
  } catch (error) {
    console.error('SSL check failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify SSL certificate');
  }
};

/**
 * Determines the status of an SSL certificate
 */
export const determineSSLStatus = (expiryDate: string, warningThreshold: number, expiryThreshold: number): string => {
  const expirationDate = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration <= 0) {
    return "expired";
  } else if (daysUntilExpiration <= expiryThreshold) {
    return "expiring_soon";
  } else if (daysUntilExpiration > expiryThreshold) {
    return "valid";
  } else {
    return "unknown";
  }
};