
import { ServicesTranslations } from '../types/services';

export const servicesTranslations: ServicesTranslations = {
  serviceStatus: "ស្ថានភាព",
  uptime: "រយៈពេលដំណើរការ",
  lastChecked: "បានពិនិត្យចុងក្រោយ",
  noServices: "គ្មានសេវាកម្មណាមួយត្រូវនឹងលក្ខណៈវិនិច្ឆ័យតម្រងរបស់អ្នកទេ។",
  currentlyMonitoring: "កំពុងត្រួតពិនិត្យ",
  retry: "សាកល្បងម្តងទៀត",
  overview: "ទិដ្ឋភាពទូទៅ",
  newService: "សេវាកម្មថ្មី",
  rowsPerPage: "ជួរដេកក្នុងមួយទំព័រ",
  search: "ស្វែងរក",
  allTypes: "គ្រប់ប្រភេទ",
  createNewService: "បង្កើតសេវាកម្មថ្មី",
  createNewServiceDesc: "បំពេញព័ត៌មានលម្អិតដើម្បីបង្កើតសេវាកម្មថ្មីសម្រាប់ត្រួតពិនិត្យ។",

  // ServiceBasicFields.tsx
  serviceName: "ឈ្មោះសេវាកម្ម",
  serviceNameDesc: "បញ្ចូលឈ្មោះដែលពិពណ៌នាអំពីសេវាកម្មរបស់អ្នក",

  // ServiceConfigFields.tsx
  checkInterval: "ចន្លោះពេលពិនិត្យ",
  seconds: "វិនាទី",
  minute: "នាទី",
  minutes: "នាទី",
  hour: "ម៉ោង",
  hours: "ម៉ោង",
  custom: "ផ្ទាល់ខ្លួន",
  checkIntervalPlaceholder: "បញ្ចូលចន្លោះពេលជាវិនាទី",
  backToPresets: "ត្រឡប់ទៅការកំណត់ជាមុន",
  checkIntervalDesc: "ភាពញឹកញាប់នៃការពិនិត្យស្ថានភាពសេវាកម្ម",
  checkIntervalDescCustom: "បញ្ចូលចន្លោះពេលផ្ទាល់ខ្លួនជាវិនាទី (អប្បបរមា ១០ វិនាទី)",
  retryAttempts: "ការព្យាយាមឡើងវិញ",
  attempt: "ការព្យាយាម",
  attempts: "ការព្យាយាម",
  retryAttemptsDesc: "ចំនួនការព្យាយាមឡើងវិញមុននឹងចាត់ទុកថាមិនដំណើរការ",

  // ServiceForm.tsx
  updateService: "ធ្វើបច្ចុប្បន្នភាពសេវាកម្ម",
  createService: "បង្កើតសេវាកម្ម",

  // ServiceNotificationFields.tsx
  enableNotifications: "បើកការជូនដំណឹង",
  enableNotificationsDesc: "បើក ឬបិទការជូនដំណឹងសម្រាប់សេវាកម្មនេះ",
  notificationChannels: "បណ្តាញជូនដំណឹង",
  notificationChannelsEnabledDesc: "ជ្រើសរើសបណ្តាញជូនដំណឹងសម្រាប់សេវាកម្មនេះ",
  notificationChannelsDesc: "បើកការជូនដំណឹងជាមុនដើម្បីជ្រើសរើសបណ្តាញ",
  notificationChannelsPlaceholder: "បន្ថែមបណ្តាញជូនដំណឹង",
  alertTemplate: "ទម្រង់ជូនដំណឹង",
  alertTemplateLoading: "កំពុងផ្ទុកទម្រង់...",
  alertTemplatePlaceholder: "ជ្រើសរើសទម onderwerpជូនដំណឹង",
  alertTemplateEnabledDesc: "ជ្រើសរើសទម្រង់សម្រាប់សារជូនដំណឹង",
  alertTemplateDesc: "បើកការជូនដំណឹងជាមុនដើម្បីជ្រើសរើសទម្រង់",

  // ServiceTypeField.tsx
  serviceType: "ប្រភេទ",
  serviceTypeHTTPDesc: "ត្រួតពិនិត្យគេហទំព័រ និង REST APIs ជាមួយពិធីការ HTTP/HTTPS",
  serviceTypePINGDesc: "ត្រួតពិនិត្យភាពអាចប្រើបានរបស់ម៉ាស៊ីនជាមួយពិធីការ PING",
  serviceTypeTCPDesc: "ត្រួតពិនិត្យការតភ្ជាប់ច្រក TCP ជាមួយពិធីការ TCP",
  serviceTypeDNSDesc: "ត្រួតពិនិត្យការដោះស្រាយ DNS",

  // ServiceRegionalFields.tsx
  regionalMonitoring: "ការត្រួតពិនិត្យតាមតំបន់",
  regionalMonitoringDesc: "ចាត់តាំងសេវាកម្មនេះទៅភ្នាក់ងារត្រួតពិនិត្យតាមតំបន់សម្រាប់ការត្រួតពិនិត្យចែកចាយ",
  regionalAgents: "ភ្នាក់ងារតាមតំបន់",
  regionalAgentsLoading: "កំពុងផ្ទុកភ្នាក់ងារ...",
  regionalAgentsAvailablePlaceholder: "ជ្រើសរើសភ្នាក់ងារតាមតំបន់បន្ថែម...",
  regionalAgentsAllSelected: "បានជ្រើសរើសភ្នាក់ងារទាំងអស់ដែលមាន",
  regionalAgentsNoAvailable: "គ្មានភ្នាក់ងារតាមតំបន់ដែលអាចប្រើបាន",
  regionalAgentsNoOnlineAvailable: "គ្មានភ្នាក់ងារតាមតំបន់អនឡាញដែលអាចប្រើបាន",
  regionalAgentsNotFoundMessage: "រកមិនឃើញភ្នាក់ងារតាមតំបន់អនឡាញទេ។ សេវាកម្មនឹងប្រើការត្រួតពិនិត្យលំនាំដើម។",
  regionalAgentsNotSelectedMessage: "មិនបានជ្រើសរើសភ្នាក់ងារតាមតំបន់ទេ។ សេវាកម្មនឹងប្រើការត្រួតពិនិត្យលំនាំដើម។",

  // ServiceUrlField.tsx
  targetDefault: "URL/ម៉ាស៊ីនគោលដៅ",
  targetDNS: "ឈ្មោះដែន",
  targetHTTPDesc: "បញ្ចូល URL ពេញលេញរួមទាំងពិធីការ (http:// ឬ https://)",
  targetPINGDesc: "បញ្ចូលឈ្មោះម៉ាស៊ីន ឬអាសយដ្ឋាន IP ដើម្បី ping",
  targetTCPDesc: "បញ្ចូលឈ្មោះម៉ាស៊ីន ឬអាសយដ្ឋាន IP សម្រាប់ការធ្វើតេស្តការតភ្ជាប់ TCP",
  targetTCPPortDesc: "បញ្ចូលលេខច្រកសម្រាប់ការធ្វើតេស្តការតភ្ជាប់ TCP",
  targetDNSDesc: "បញ្ចូលឈ្មោះដែនសម្រាប់ការត្រួតពិនិត្យកំណត់ត្រា DNS (A, AAAA, MX, ជាដើម)",
  targetDefaultDesc: "បញ្ចូល URL ឬឈ្មោះម៉ាស៊ីនគោលដៅសម្រាប់ការត្រួតពិនិត្យ",
  targetDefaultPlaceholder: "បញ្ចូល URL ឬឈ្មោះម៉ាស៊ីន",

  // types.ts
  serviceNameRequired: "តម្រូវឱ្យមានឈ្មោះសេវាកម្ម",
  urlDomainHostRequired: "តម្រូវឱ្យមាន URL/ដែន/ម៉ាស៊ីន",
  enterValidUrlHostnameDomain: "សូមបញ្ចូល URL, ឈ្មោះម៉ាស៊ីន ឬដែនដែលត្រឹមត្រូវ",

  // Dashboard
  upServices: "សេវាកម្មដំណើរការ",
  downServices: "សេវាកម្មមិនដំណើរការ",
  pausedServices: "សេវាកម្មផ្អាក",
  warningServices: "សេវាកម្មព្រមាន",

  // ServiceRowActions.tsx
  viewDetail: "មើលលម្អិត",
  resumeMonitoring: "បន្តការត្រួតពិនិត្យ",
  pauseMonitoring: "ផ្អាកការត្រួតពិនិត្យ",

  // IncidentTable.tsx
  responseTime: "ពេលវេលាឆ្លើយតប",
  errorMessage: "សារកំហុស",
  details: "លម្អិត",
  unmuteAlerts: "បើកសំឡេងការជូនដំណឹង",
  muteAlerts: "បិទសំឡេងការជូនដំណឹង",

  // LastCheckedTime.tsx
  pausedAt: "ផ្អាកនៅ",
  lastCheckDetails: "លម្អិតការពិនិត្យចុងក្រោយ",
  checkedAt: "បានពិនិត្យនៅ",
  monitoringPaused: "ការត្រួតពិនិត្យត្រូវបានផ្អាក",
  noAutomaticChecks: "គ្មានការពិនិត្យដោយស្វ័យប្រវត្តិ",

  // ServiveEditDialog.tsx
  editService: "កែសម្រួលសេវាកម្ម",
  editServiceDesc: "ធ្វើបច្ចុប្បន្នភាពលម្អិតនៃសេវាកម្មដែលត្រូវបានត្រួតពិនិត្យរបស់អ្នក។",

  // ServiceStatsCards.tsx
  lastCheckedAt: "បានពិនិត្យចុងក្រោយនៅ {datetime}",
  avg: "មធ្យម",
  lastUpChecksCount: "ការពិនិត្យដំណើរការចុងក្រោយ {count} ដង",
  basedOnlastChecksCount: "ផ្អែកលើការពិនិត្យចុងក្រោយ {count} ដង",
  totalUptime: "រយៈពេលដំណើរការសរុប",
  totalDowntime: "រយៈពេលមិនដំណើរការសរុប",
  monitoringSettings: "ការកំណត់ការត្រួតពិនិត្យ",
  monitoringSettingsInterval: "បានពិនិត្យរៀងរាល់ {interval} វិនាទី",
  monitoringSettingsType: "ការត្រួតពិនិត្យ",
  upStatusDuration: "ដំណើរការអស់រយៈពេល {duration}",
  downStatusDuration: "មិនដំណើរការអស់រយៈពេល {duration}",

  incidentHistory: "ប្រវត្តិឧប្បត្តិហេតុ",
  processing: "កំពុងដំណើរការ",
  back: "ត្រឡប់ក្រោយ",
  last20Checks: "ការពិនិត្យ ២០ ចុងក្រោយ",

  //OneClickInstallTab.tsx
  oneClickInstallTitle: "ការដំឡើងតែមួយចុច (ណែនាំ)",
  oneClickInstallDesc: "ចម្លង និងបិទភ្ជាប់ពាក្យបញ្ជាតែមួយនេះដើម្បីដំឡើងភ្នាក់ងារត្រួតពិនិត្យភ្លាមៗ",
  quickInstallCommand: "ពាក្យបញ្ជាដំឡើងរហ័ស",
  copy: "ចម្លង",
  runCommandOnServer: "គ្រាន់តែដំណើរការពាក្យបញ្ជានេះនៅលើម៉ាស៊ីនមេរបស់អ្នក:",
  sshIntoServer: "ចូលទៅក្នុងម៉ាស៊ីនមេគោលដៅរបស់អ្នកតាម SSH",
  pasteAndRun: "បិទភ្ជាប់ និងដំណើរការពាក្យបញ្ជាខាងលើ",
  agentInstalled: "ភ្នាក់ងារនឹងត្រូវបានដំឡើង និងចាប់ផ្តើមដោយស្វ័យប្រវត្តិ",
  done: "រួចរាល់",

  // DockerOneClickTab.tsx
  dockerOneClickTitle: "ការដំឡើង Docker តែមួយចុច",
  dockerOneClickDesc: "ការដំឡើង Docker Container ដោយស្វ័យប្រវត្តិជាមួយនឹងសមត្ថភាពត្រួតពិនិត្យប្រព័ន្ធ",
  dockerOneClickCommand: "ពាក្យបញ្ជា Docker តែមួយចុច",
  dockerScriptWill: "ស្គ្រីបនេះនឹងធ្វើដោយស្វ័យប្រវត្តិ:",
  dockerScriptStep1: "ទាញយក និងរៀបចំភ្នាក់ងារត្រួតពិនិត្យ Docker",
  dockerScriptStep2: "កំណត់រចនាសម្ព័ន្ធអថេរបរិស្ថានដែលតម្រូវទាំងអស់",
  dockerScriptStep3: "ចាប់ផ្តើម Container ជាមួយនឹងការចូលប្រើប្រព័ន្ធត្រឹមត្រូវ",
  dockerScriptStep4: "រៀបចំការរក្សាទុកទិន្នន័យត្រួតពិនិត្យ",
  directDockerTitle: "ពាក្យបញ្ជា Docker Run ដោយផ្ទាល់",
  directDockerDesc: "ប្រសិនបើអ្នកចូលចិត្តដំណើរការ Docker Container ដោយផ្ទាល់ដោយគ្មានស្គ្រីប",
  dockerRunCommand: "ពាក្យបញ្ជា Docker Run",
  dockerPrerequisites: "តម្រូវការជាមុនសម្រាប់ការដំណើរការ Docker ដោយផ្ទាល់:",
  dockerPrereqStep1: "Docker ត្រូវតែត្រូវបានដំឡើង និងដំណើរការ",
  dockerPrereqStep2: "រូបភាព operacle/checkcle-server-agent ត្រូវតែមាន",
  dockerPrereqStep3: "ដំណើរការជា root ឬជាមួយសិទ្ធិ sudo",

  // ManualInstallTab.tsx
  manualInstallTitle: "ជំហានការដំឡើងដោយដៃ",
  manualInstallDesc: "ដំណើរការដំឡើងជាជំហានៗ",
  serverName: "ឈ្មោះម៉ាស៊ីនមេ",
  agentId: "លេខសម្គាល់ភ្នាក់ងារ",
  osType: "ប្រភេទប្រព័ន្ធប្រតិបត្តិការ",
  downloadScript: "ទាញយកស្គ្រីបដំឡើង",
  makeExecutable: "ធ្វើឱ្យស្គ្រីបអាចប្រតិបត្តិបាន",
  runInstall: "ដំណើរការការដំឡើងជាមួយនឹងការកំណត់រចនាសម្ព័ន្ធរបស់អ្នក",
  prerequisites: "តម្រូវការជាមុន:",
  prereqRoot: "ត្រូវប្រាកដថាអ្នកមានសិទ្ធិ root/sudo នៅលើម៉ាស៊ីនមេគោលដៅ",
  prereqCurl: "ត្រូវប្រាកដថា curl ត្រូវបានដំឡើងសម្រាប់ទាញយកឯកសារ",
  prereqInternet: "តម្រូវឱ្យមានការតភ្ជាប់អ៊ីនធឺណិតសម្រាប់ទាញយកស្គ្រីប",
  afterInstall: "បន្ទាប់ពីការដំឡើង:",
  agentWillStart: "ភ្នាក់ងារនឹងចាប់ផ្តើមដោយស្វ័យប្រវត្តិ និងនឹងបង្ហាញនៅក្នុងផ្ទាំងគ្រប់គ្រងរបស់អ្នកក្នុងរយៈពេលប៉ុន្មាននាទី។",

  // ServerDetail.tsx
  errorLoadingServer: "កំហុសក្នុងការផ្ទុកម៉ាស៊ីនមេ",
  unableToFetchServerData: "មិនអាចទាញយកទិន្នន័យម៉ាីនមេបានទេ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។",
  backToServers: "ត្រឡប់ទៅម៉ាស៊ីនមេ",
  loadingServerDetails: "កំពុងផ្ទុកព័ត៌មានលម្អិតម៉ាស៊ីនមេ...",
  serverDetail: "ព័ត៌មានលម្អិតម៉ាស៊ីនមេ",
  monitorServerMetrics: "ត្រួតពិនិត្យMetricsប្រសិទ្ធភាពម៉ាស៊ីនមេ និងសុខភាពប្រព័ន្ធ",
  serverHostnameIpOs: "{hostname} • {ip_address} • {os_type}",

  // ContainerMonitoring.tsx
  errorLoadingContainers: "កំហុសក្នុងការផ្ទុក Container",
  unableToFetchContainerData: "មិនអាចទាញយកទិន្នន័យ Container បានទេ?। សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។",
  errorUnknown: "កំហុសមិនស្គាល់",
  containerMonitoring: "ការត្រួតពិនិត្យ Container",
  monitorAndManageContainers: "ត្រួតពិនិត្យ និងគ្រប់គ្រង Docker Container របស់អ្នកក្នុងពេលជាក់ស្តែង",
  serverIdLabel: "លេខសម្គាល់ម៉ាស៊ីនមេ",

};
