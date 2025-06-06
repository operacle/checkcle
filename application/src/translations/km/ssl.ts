
import { SSLTranslations } from '../types/ssl';

export const sslTranslations: SSLTranslations = {
  // Page and section titles
  sslDomainManagement: "ការគ្រប់គ្រង SSL និង ដូមេន",
  monitorSSLCertificates: "តាមដាន និង គ្រប់គ្រងវិញ្ញាបនបត្រ SSL សម្រាប់ដូមេនរបស់អ្នក",
  addSSLCertificate: "បន្ថែមវិញ្ញាបនបត្រ SSL",
  editSSLCertificate: "កែសម្រួលវិញ្ញាបនបត្រ SSL",
  deleteSSLCertificate: "លុបវិញ្ញាបនបត្រ SSL",
  sslCertificateDetails: "ព័ត៌មានលម្អិតនៃវិញ្ញាបនបត្រ SSL",
  detailedInfo: "ព័ត៌មានលម្អិតសម្រាប់",

  // Status related
  valid: "មានសុពលភាព",
  expiringSoon: "ជិតផុតកំណត់",
  expired: "ផុតកំណត់",
  pending: "កំពុងរង់ចាំ",

  // Statistics and cards
  validCertificates: "វិញ្ញាបនបត្រមានសុពលភាព",
  expiringSoonCertificates: "ជិតផុតកំណត់",
  expiredCertificates: "វិញ្ញាបនបត្រផុតកំណត់",

  // Form fields
  domain: "ដូមេន",
  domainName: "ឈ្មោះដូមេន",
  domainCannotChange: "ដូមេនមិនអាចផ្លាស់ប្តូរបានបន្ទាប់ពីការបង្កើត",
  warningThreshold: "កម្រិតព្រមាន",
  warningThresholdDays: "កម្រិតព្រមាន (ថ្ងៃ)",
  expiryThreshold: "កម្រិតផុតកំណត់",
  expiryThresholdDays: "កម្រិតផុតកំណត់ (ថ្ងៃ)",
  notificationChannel: "ឆានែលជូនដំណឹង",
  chooseChannel: "ជ្រើសរើសឆានែលជូនដំណឹង",
  whereToSend: "ទីកន្លែងដែលត្រូវផ្ញើការជូនដំណឹង",
  daysBeforeExpiration: "ថ្ងៃមុនពេលផុតកំណត់ដើម្បីទទួលបានការព្រមាន",
  daysBeforeCritical: "ថ្ងៃមុនពេលផុតកំណត់ដើម្បីទទួលបានការជូនដំណឹងសំខាន់ៗ",
  getNotifiedExpiration: "ទទួលការជូនដំណឹងនៅពេលវិញ្ញាបនបត្រជិតផុតកំណត់",
  getNotifiedCritical: "ទទួលការជូនដំណឹងនៅពេលវិញ្ញាបនបត្រជិតដល់ពេលផុតកំណត់ខ្លាំង",

  // Table headers and fields
  issuer: "អ្នកចេញផ្សាយ",
  expirationDate: "កាលបរិច្ឆេទផុតកំណត់",
  daysLeft: "ថ្ងៃនៅសល់",
  status: "ស្ថានភាព",
  lastNotified: "ជូនដំណឹងចុងក្រោយ",
  actions: "សកម្មភាព",
  validFrom: "មានសុពលភាពចាប់ពី",
  validUntil: "មានសុពលភាពរហូតដល់",
  validityDays: "ថ្ងៃសុពលភាព",
  organization: "អង្គការ",
  commonName: "ឈ្មោះទូទៅ",
  serialNumber: "លេខសៀរៀល",
  algorithm: "អាល់ហ្គោរីត",
  subjectAltNames: "ឈ្មោះផ្សេងៗដែលអាចប្រើបាន",
  
  // Buttons and actions
  addDomain: "បន្ថែមដូមេន",
  refreshAll: "ធ្វើបច្ចុប្បន្នភាពទាំងអស់",
  cancel: "បោះបង់",
  addCertificate: "បន្ថែមវិញ្ញាបនប័ត្រ",
  check: "ពិនិត្យ",
  view: "មើល",
  edit: "កែសម្រួល",
  delete: "លុប",
  close: "បិទ",
  saveChanges: "រក្សាទុកការផ្លាស់ប្តូរ",
  updating: "កំពុងធ្វើបច្ចុប្បន្នភាព",
  
  // Sections in detail view
  basicInformation: "ព័ត៌មានមូលដ្ឋាន",
  validity: "សុពលភាព",
  issuerInfo: "ព័ត៌មានអ្នកចេញផ្សាយ",
  technicalDetails: "ព័ត៌មានបច្ចេកទេស",
  monitoringConfig: "ការកំណត់រចនាសម្ព័ន្ធការតាមដាន",
  recordInfo: "ព័ត៌មានកំណត់ត្រា",
  
  // Notifications and messages
  sslCertificateAdded: "វិញ្ញាបនបត្រ SSL បានបន្ថែមដោយជោគជ័យ",
  sslCertificateUpdated: "វិញ្ញាបនបត្រ SSL បានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ",
  sslCertificateDeleted: "វិញ្ញាបនបត្រ SSL ត្រូវបានលុបដោយជោគជ័យ",
  sslCertificateRefreshed: "វិញ្ញាបនបត្រ SSL សម្រាប់ {domain} បានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ",
  allCertificatesRefreshed: "វិញ្ញាបនបត្រទាំងអស់ {count} បានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ",
  someCertificatesFailed: "វិញ្ញាបនប័ត្រ {success} បានធ្វើបច្ចុប្បន្នភាព, {failed} បានបរាជ័យ",
  failedToAddCertificate: "បរាជ័យក្នុងការបន្ថែមវិញ្ញាបនបត្រ SSL",
  failedToLoadCertificates: "បរាជ័យក្នុងការផ្ទុកវិញ្ញាបនបត្រ SSL",
  failedToUpdateCertificate: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពវិញ្ញាបនបត្រ SSL",
  failedToDeleteCertificate: "បរាជ័យក្នុងការលុបវិញ្ញាបនបត្រ SSL",
  failedToCheckCertificate: "បរាជ័យក្នុងការពិនិត្យមើលវិញ្ញាបនបត្រ SSL",
  noCertificatesToRefresh: "មិនមានវិញ្ញាបនបត្រដើម្បីធ្វើបច្ចុប្បន្នភាពទេ",
  startingRefreshAll: "ចាប់ផ្តើមធ្វើបច្ចុប្បន្នភាពវិញ្ញាបនបត្រចំនួន {count}",
  checkingSSLCertificate: "កំពុងពិនិត្យមើលវិញ្ញាបនបត្រ SSL...",
  deleteConfirmation: "តើអ្នកពិតជាចង់លុបវិញ្ញាបនបត្រសម្រាប់",
  deleteWarning: "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ វានឹងលុបវិញ្ញាបនបត្រជាអចិន្ត្រៃយ៍។",
  
  // Misc
  unknown: "មិនស្គាល់",
  never: "មិនដែល",
  none: "គ្មាន",
  loadingChannels: "កំពុងផ្ទុកឆានែល...",
  noChannelsFound: "រកមិនឃើញឆានែលជូនដំណឹងទេ",
  noSSLCertificates: "រកមិនឃើញវិញ្ញាបនបត្រ SSL ទេ",
  created: "បានបង្កើត",
  lastUpdated: "បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
  lastNotification: "ការជូនដំណឹងចុងក្រោយ",
  collectionId: "លេខសម្គាល់ប្រមូលផ្តុំ"
};
