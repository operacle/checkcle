
import { SSLCheckerResponse } from "./types";

// Calculate days remaining from expiration date
export function calculateDaysRemaining(validTo: string): number {
  try {
    const expirationDate = new Date(validTo);
    const currentDate = new Date();
    const diffTime = expirationDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert ms to days
  } catch (error) {
    console.error("Error calculating days remaining:", error);
    return 0;
  }
}

// Check if the certificate is valid
export function isValid(validTo: string): boolean {
  try {
    return new Date(validTo).getTime() > Date.now();
  } catch (error) {
    console.error("Error checking certificate validity:", error);
    return false;
  }
}

// Convert results to our expected response format
export function convertResultToResponse(result: any): SSLCheckerResponse {
  return {
    version: "1.0",
    app: "ssl-checker",
    host: result.host || "",
    response_time_sec: result.response_time_sec || "0.5",
    status: result.status || "ok",
    result: {
      host: result.host || "",
      issued_to: result.subject || result.host || "",
      issuer_o: result.issuer || "Unknown",
      cert_sn: result.serial_number || "0",
      cert_alg: result.algorithm || "Unknown",
      cert_sans: result.sans || "",
      cert_exp: !result.is_valid,
      cert_valid: result.is_valid || false,
      valid_from: result.valid_from || new Date().toISOString(),
      valid_till: result.valid_to || new Date().toISOString(),
      validity_days: result.validity_days || 365,
      days_left: result.days_remaining || 0,
      valid_days_to_expire: result.days_remaining || 0
    }
  };
}