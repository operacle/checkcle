
import { pb } from "@/lib/pocketbase";
import type { AddSSLCertificateDto, SSLCertificate } from "./types";
import { checkSSLCertificate } from "./sslCheckerService";
import { determineSSLStatus } from "./sslStatusUtils";
import { checkCertificateAndNotify } from "./notification"; // Import notification service
import { toast } from "sonner";

/**
 * Add a new SSL certificate to monitor
 */
export const addSSLCertificate = async (
  certificateData: AddSSLCertificateDto
): Promise<SSLCertificate> => {
  try {
    // First check if the SSL certificate is valid and can be fetched
    const sslData = await checkSSLCertificate(certificateData.domain);

    if (!sslData || !sslData.result) {
      throw new Error(`Could not fetch SSL certificate for ${certificateData.domain}`);
    }

    // Prepare the data for saving to database
    const data = {
      domain: certificateData.domain,
      issued_to: sslData.result.issued_to || certificateData.domain,
      issuer_o: sslData.result.issuer_o || "",
      status: determineSSLStatus(
        sslData.result.days_left || 0, 
        certificateData.warning_threshold,
        certificateData.expiry_threshold
      ),
      cert_sans: sslData.result.cert_sans || "",
      cert_alg: sslData.result.cert_alg || "",
      serial_number: sslData.result.cert_sn || "",
      valid_from: sslData.result.valid_from || new Date().toISOString(),
      valid_till: sslData.result.valid_till || new Date().toISOString(),
      validity_days: sslData.result.validity_days || 0,
      days_left: sslData.result.days_left || 0,
      warning_threshold: Number(certificateData.warning_threshold) || 30,
      expiry_threshold: Number(certificateData.expiry_threshold) || 7,
      notification_channel: certificateData.notification_channel || "",
    };

    // Save to database
    const record = await pb.collection("ssl_certificates").create(data);

    return record as unknown as SSLCertificate;
  } catch (error) {
    console.error("Error adding SSL certificate:", error);
    throw error;
  }
};

/**
 * Check and update a specific SSL certificate
 */
export const checkAndUpdateCertificate = async (
  certificateId: string
): Promise<SSLCertificate> => {
  try {
    // Get the certificate from database
    const certificate = await pb.collection("ssl_certificates").getOne(certificateId);

    if (!certificate) {
      throw new Error(`Certificate with ID ${certificateId} not found`);
    }

    const typedCertificate = certificate as unknown as SSLCertificate;
    const domain = typedCertificate.domain;

    // Check SSL certificate
    const sslData = await checkSSLCertificate(domain);

    if (!sslData || !sslData.result) {
      throw new Error(`Could not fetch SSL certificate for ${domain}`);
    }

    // Update certificate data
    const updateData = {
      issued_to: sslData.result.issued_to || domain,
      issuer_o: sslData.result.issuer_o || typedCertificate.issuer_o,
      status: determineSSLStatus(
        sslData.result.days_left || 0, 
        typedCertificate.warning_threshold,
        typedCertificate.expiry_threshold
      ),
      cert_sans: sslData.result.cert_sans || typedCertificate.cert_sans,
      cert_alg: sslData.result.cert_alg || typedCertificate.cert_alg,
      serial_number: sslData.result.cert_sn || typedCertificate.serial_number,
      valid_from: sslData.result.valid_from || typedCertificate.valid_from,
      valid_till: sslData.result.valid_till || typedCertificate.valid_till,
      validity_days: sslData.result.validity_days || typedCertificate.validity_days,
      days_left: sslData.result.days_left || 0,
    };

    // Update in database
    const updatedCert = await pb
      .collection("ssl_certificates")
      .update(certificateId, updateData);
    
    const updatedCertificate = updatedCert as unknown as SSLCertificate;
    
    // After updating, check if notification should be sent
    // This will respect the Warning and Expiry Thresholds
    await checkCertificateAndNotify(updatedCertificate);
    
    return updatedCertificate;
  } catch (error) {
    console.error("Error updating SSL certificate:", error);
    throw error;
  }
};

/**
 * Delete an SSL certificate from monitoring
 */
export const deleteSSLCertificate = async (id: string): Promise<boolean> => {
  try {
    await pb.collection("ssl_certificates").delete(id);
    return true;
  } catch (error) {
    console.error("Error deleting SSL certificate:", error);
    throw error;
  }
};

/**
 * Refresh all SSL certificates
 */
export const refreshAllCertificates = async (): Promise<{ success: number; failed: number }> => {
  try {
    const response = await pb.collection("ssl_certificates").getList(1, 100);
    const certificates = response.items as unknown as SSLCertificate[];

    console.log(`Refreshing ${certificates.length} certificates...`);

    let success = 0;
    let failed = 0;

    for (const cert of certificates) {
      try {
        await checkAndUpdateCertificate(cert.id);
        success++;
      } catch (error) {
        console.error(`Failed to refresh certificate ${cert.domain}:`, error);
        failed++;
      }
    }

    return { success, failed };
  } catch (error) {
    console.error("Error refreshing certificates:", error);
    throw error;
  }
};