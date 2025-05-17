
// This file re-exports all SSL certificate related services for backward compatibility
import { 
  checkSSLCertificate,
  fetchSSLCertificates,
  addSSLCertificate,
  checkAndUpdateCertificate
} from './ssl';

import { determineSSLStatus } from './ssl/sslStatusUtils';

// Import from the new refactored location
import {
  checkAllCertificatesAndNotify,
  checkCertificateAndNotify,
  shouldRunDailyCheck
} from './ssl/notification';

export {
  checkSSLCertificate,
  determineSSLStatus,
  fetchSSLCertificates,
  addSSLCertificate,
  checkAndUpdateCertificate,
  checkAllCertificatesAndNotify,
  checkCertificateAndNotify,
  shouldRunDailyCheck
};