
// Re-export all SSL-related functionality for domain SSL checking
// Use explicit re-exports to avoid naming conflicts

// SSL Checker service
export { checkSSLCertificate, checkSSLApi } from './sslCheckerService';

// SSL Status utilities
export { determineSSLStatus } from './sslStatusUtils';

// Primary export for fetchSSLCertificates
export { fetchSSLCertificates } from './sslFetchService';

// Certificate operations
export { 
  addSSLCertificate,
  checkAndUpdateCertificate,
  deleteSSLCertificate,
  refreshAllCertificates
} from './sslCertificateOperations';

// SSL-specific notification service
export {
  checkAllCertificatesAndNotify,
  checkCertificateAndNotify,
  shouldRunDailyCheck,
  sendSSLNotification
} from './notification';

// Export types
export type { SSLCheckerResponse, SSLCertificate, AddSSLCertificateDto, SSLNotification } from './types';

// Export utility functions
export { normalizeDomain, createErrorResponse } from './sslCheckerUtils';

// Export checking mechanisms
export { checkWithFetch } from './sslPrimaryChecker';