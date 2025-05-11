
import { pb } from "@/lib/pocketbase";
import { AddSSLCertificateDto, SSLCertificate } from "@/types/ssl.types";
import { checkDomainSSL, determineSSLStatus } from "@/utils/sslUtils";
import { toast } from "sonner";

const fetchSSLCertificates = async (): Promise<SSLCertificate[]> => {
  try {
    // Using the PocketBase client to fetch SSL certificates
    const response = await pb.collection('ssl_certificates').getList(1, 50, {
      sort: '-created',
    });

    // Transform the data if needed
    return response.items.map(cert => ({
      id: cert.id,
      domain: cert.domain,
      port: cert.port || 443,
      issuer: cert.issuer,
      expiration_date: cert.expiration_date,
      status: determineSSLStatus(cert.expiration_date, cert.warning_threshold, cert.expiry_threshold),
      last_notified: cert.last_notified,
      warning_threshold: cert.warning_threshold,
      expiry_threshold: cert.expiry_threshold,
      notification_channel: cert.notification_channel,
      created: cert.created,
      updated: cert.updated
    }));
  } catch (error) {
    console.error("Error fetching SSL certificates:", error);
    throw error;
  }
};

const addSSLCertificate = async (certificateData: AddSSLCertificateDto): Promise<SSLCertificate> => {
  try {
    // Perform actual SSL check on the domain
    const sslCheck = await checkDomainSSL(certificateData.domain, certificateData.port);
    
    if (sslCheck.error) {
      throw new Error(`SSL certificate check failed: ${sslCheck.error}`);
    }
    
    // Prepare data with the actual certificate information
    const dataToSubmit = {
      ...certificateData,
      issuer: sslCheck.issuer,
      expiration_date: sslCheck.expirationDate,
      status: determineSSLStatus(
        sslCheck.expirationDate, 
        certificateData.warning_threshold, 
        certificateData.expiry_threshold
      ),
    };

    const response = await pb.collection('ssl_certificates').create(dataToSubmit);
    
    return {
      id: response.id,
      domain: response.domain,
      port: response.port,
      issuer: response.issuer,
      expiration_date: response.expiration_date,
      status: determineSSLStatus(
        response.expiration_date, 
        response.warning_threshold, 
        response.expiry_threshold
      ),
      last_notified: response.last_notified || '',
      warning_threshold: response.warning_threshold,
      expiry_threshold: response.expiry_threshold,
      notification_channel: response.notification_channel,
      created: response.created,
      updated: response.updated
    };
  } catch (error) {
    console.error("Error adding SSL certificate:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add SSL certificate");
    throw error;
  }
};

// Function to check and update an existing certificate
const checkAndUpdateCertificate = async (certificateId: string): Promise<SSLCertificate> => {
  try {
    // Fetch the current certificate data
    const currentCert = await pb.collection('ssl_certificates').getOne(certificateId);
    
    // Perform SSL check
    const sslCheck = await checkDomainSSL(currentCert.domain, currentCert.port);
    
    if (sslCheck.error) {
      throw new Error(`SSL certificate check failed: ${sslCheck.error}`);
    }
    
    // Update with new information
    const updatedData = {
      issuer: sslCheck.issuer,
      expiration_date: sslCheck.expirationDate,
      status: determineSSLStatus(
        sslCheck.expirationDate, 
        currentCert.warning_threshold, 
        currentCert.expiry_threshold
      ),
      updated: new Date().toISOString()
    };
    
    const response = await pb.collection('ssl_certificates').update(certificateId, updatedData);
    
    return {
      id: response.id,
      domain: response.domain,
      port: response.port,
      issuer: response.issuer,
      expiration_date: response.expiration_date,
      status: determineSSLStatus(
        response.expiration_date, 
        response.warning_threshold, 
        response.expiry_threshold
      ),
      last_notified: response.last_notified || '',
      warning_threshold: response.warning_threshold,
      expiry_threshold: response.expiry_threshold,
      notification_channel: response.notification_channel,
      created: response.created,
      updated: response.updated
    };
  } catch (error) {
    console.error("Error updating SSL certificate:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update SSL certificate");
    throw error;
  }
};

export { fetchSSLCertificates, addSSLCertificate, checkAndUpdateCertificate };