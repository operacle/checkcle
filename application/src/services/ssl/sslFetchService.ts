
import { pb } from "@/lib/pocketbase";
import { SSLCertificate } from "@/types/ssl.types";
import { toast } from "sonner";

/**
 * Fetch SSL certificates from PocketBase
 */
export const fetchSSLCertificates = async (): Promise<SSLCertificate[]> => {
  try {
    console.log("Fetching SSL certificates from PocketBase...");
    
    // Using the direct API path to fetch SSL certificates
    const endpoint = "/api/collections/ssl_certificates/records";
    const params = {
      page: 1,
      perPage: 50,
      sort: "-created",
      cache: Date.now() // Prevent caching by adding a timestamp
    };
    
    // Convert params to query string
    const queryString = new URLSearchParams(params as any).toString();
    const fullEndpoint = `${endpoint}?${queryString}`;
    
    console.log("Fetching SSL certificates from:", fullEndpoint);
    const response = await pb.send(fullEndpoint, {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    // Check if response has expected structure
    if (!response || !response.items) {
      console.error("Invalid response format:", response);
      toast.error("Failed to fetch SSL certificates: Invalid response format");
      throw new Error("Invalid response format from PocketBase API");
    }

    console.log("Received SSL certificates:", response.items.length);
    
    // Map items to SSLCertificate[] type with validation
    return response.items.map(item => {
      const cert = item as SSLCertificate;
      
      // Log certificate details for debugging
      console.log(`Certificate for ${cert.domain}: Issued by ${cert.issuer_o}, Days left: ${cert.days_left}`);
      
      // Ensure dates are valid
      try {
        if (cert.valid_from) new Date(cert.valid_from).toISOString();
        if (cert.valid_till) new Date(cert.valid_till).toISOString();
        if (cert.last_notified) new Date(cert.last_notified).toISOString();
      } catch (e) {
        console.warn("Invalid date found in certificate", cert.id, e);
        // Fix invalid dates if needed
        if (cert.valid_from && isNaN(new Date(cert.valid_from).getTime())) {
          cert.valid_from = new Date().toISOString();
        }
        if (cert.valid_till && isNaN(new Date(cert.valid_till).getTime())) {
          const futureDate = new Date();
          futureDate.setFullYear(futureDate.getFullYear() + 1);
          cert.valid_till = futureDate.toISOString();
        }
      }
      
      // Calculate days left if not provided
      if (typeof cert.days_left !== 'number' && cert.valid_till) {
        try {
          const expirationDate = new Date(cert.valid_till);
          const currentDate = new Date();
          const diffTime = expirationDate.getTime() - currentDate.getTime();
          cert.days_left = Math.ceil(diffTime / (1000 * 3600 * 24));
        } catch (e) {
          console.warn("Error calculating days_left for certificate", cert.id, e);
          cert.days_left = 0;
        }
      }
      
      return cert;
    });
  } catch (error) {
    console.error("Error fetching SSL certificates:", error);
    toast.error("Failed to fetch SSL certificates. Please try again later.");
    throw error;
  }
};