
import { createErrorResponse } from "./sslCheckerUtils";
import type { SSLCheckerResponse } from "./types";

/**
 * Check SSL certificate using fetch with CORS proxy
 * This is our primary method that's proven to work
 */
export const checkWithFetch = async (domain: string): Promise<SSLCheckerResponse> => {
  console.log(`Checking SSL via CORS proxy for: ${domain}`);
  
  try {
    // Use the working CORS proxy
    const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://ssl-checker.io/api/v1/check/${domain}`)}`;
    console.log("Using CORS proxy for SSL check:", corsProxyUrl);
    
    const proxyResponse = await fetch(corsProxyUrl);
    if (!proxyResponse.ok) {
      throw new Error(`CORS proxy request failed with status: ${proxyResponse.status}`);
    }
    
    const proxyData = await proxyResponse.json();
    console.log("CORS proxy returned SSL data:", proxyData);
    return proxyData;
  } catch (error) {
    console.error("SSL check failed:", error);
    return createErrorResponse(domain, error);
  }
};