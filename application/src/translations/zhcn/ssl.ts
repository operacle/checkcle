
import { SSLTranslations } from '../types/ssl';

export const sslTranslations: SSLTranslations = {
  // Page and section titles
  sslDomainManagement: "SSL 与域名管理",
  monitorSSLCertificates: "监控并管理您域名的 SSL 证书",
  addSSLCertificate: "添加 SSL 证书",
  editSSLCertificate: "编辑 SSL 证书",
  deleteSSLCertificate: "删除 SSL 证书",
  sslCertificateDetails: "SSL 证书详情",
  detailedInfo: "详细信息",

  // Status related
  valid: "有效",
  expiringSoon: "即将到期",
  expired: "已过期",
  pending: "待处理",

  // Statistics and cards
  validCertificates: "有效证书",
  expiringSoonCertificates: "即将到期",
  expiredCertificates: "过期证书",

  // Form fields
  domain: "域",
  domainName: "域名",
  domainCannotChange: "创建后无法更改域名",
  warningThreshold: "警告阈值",
  warningThresholdDays: "警告阈值（天数）",
  expiryThreshold: "过期阈值",
  expiryThresholdDays: "过期阈值（天数）",
  notificationChannel: "通知渠道",
  chooseChannel: "选择一个通知渠道",
  whereToSend: "通知发送至何处",
  daysBeforeExpiration: "到期前几天收到警告",
  daysBeforeCritical: "到期前接收关键警报的天数",
  getNotifiedExpiration: "证书即将过期时获取通知",
  getNotifiedCritical: "证书即将严重过期时获取通知",

  // Table headers and fields
  issuer: "发行机构",
  expirationDate: "有效期",
  daysLeft: "剩余天数",
  status: "状态",
  lastNotified: "最后通知时间",
  actions: "活动",
  validFrom: "有效期自",
  validUntil: "有效期至",
  validityDays: "有效期天数",
  organization: "组织",
  commonName: "通用名称",
  serialNumber: "序列号",
  algorithm: "算法",
  subjectAltNames: "主题别名",
  
  // Buttons and actions
  addDomain: "添加域名",
  refreshAll: "刷新全部",
  cancel: "取消",
  addCertificate: "添加证书",
  check: "检查",
  view: "查看",
  edit: "编辑",
  delete: "删除",
  close: "关闭",
  saveChanges: "保存更改",
  updating: "更新中",
  
  // Sections in detail view
  basicInformation: "基本信息",
  validity: "有效性",
  issuerInfo: "发行机构信息",
  technicalDetails: "技术细节",
  monitoringConfig: "监控配置",
  recordInfo: "记录信息",
  
  // Notifications and messages
  sslCertificateAdded: "SSL 证书已成功添加",
  sslCertificateUpdated: "SSL 证书更新成功",
  sslCertificateDeleted: "SSL 证书已成功删除",
  sslCertificateRefreshed: "{domain} 的 SSL 证书已成功更新",
  allCertificatesRefreshed: "所有 {count} 张证书已成功刷新",
  someCertificatesFailed: "{success} 证书已刷新，{failed} 失败",
  failedToAddCertificate: "无法添加 SSL 证书",
  failedToLoadCertificates: "无法加载 SSL 证书",
  failedToUpdateCertificate: "无法更新 SSL 证书",
  failedToDeleteCertificate: "无法删除 SSL 证书",
  failedToCheckCertificate: "无法检查 SSL 证书",
  noCertificatesToRefresh: "没有需要更新的证书",
  startingRefreshAll: "开始刷新 {count} 个证书",
  checkingSSLCertificate: "检查 SSL 证书...",
  deleteConfirmation: "您确定要删除该证书吗",
  deleteWarning: "此操作无法撤销。证书将被永久删除。",
  
  // Misc
  unknown: "未知",
  never: "绝不",
  none: "无",
  loadingChannels: "正在加载渠道...",
  noChannelsFound: "未找到通知渠道",
  noSSLCertificates: "未找到 SSL 证书",
  created: "已创建",
  lastUpdated: "最后更新",
  lastNotification: "上次通知",
  collectionId: "集合 ID"
};
