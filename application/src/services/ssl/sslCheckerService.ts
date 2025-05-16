
import type { SSLCheckerResponse } from "./types";
import { toast } from "sonner";
import { checkWithFetch } from "./sslPrimaryChecker";
import { normalizeDomain, createErrorResponse } from "./sslCheckerUtils";

/**
 * Check SSL certificate for a domain
 * Uses the reliable CORS proxy approach
 */
export const checkSSLCertificate = async (domain: string): Promise<SSLCheckerResponse> => {
  try {
    console.log(`Checking SSL certificate for domain: ${domain}`);
    
    // Normalize domain (remove protocol if present)
    const normalizedDomain = normalizeDomain(domain);
    
    if (!normalizedDomain) {
      throw new Error("Invalid domain provided");
    }
    
    // Use the working CORS proxy approach
    const result = await checkWithFetch(normalizedDomain);
    console.log("SSL check result:", result);
    return result;
  } catch (error) {
    console.error("SSL check failed completely:", error);
    toast.error(`SSL check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return createErrorResponse(domain, error);
  }
};

/**
 * Check SSL certificate using the CORS proxy
 * This is kept for backward compatibility
 */
export const checkSSLApi = async (domain: string): Promise<SSLCheckerResponse> => {
  return checkSSLCertificate(domain);
};