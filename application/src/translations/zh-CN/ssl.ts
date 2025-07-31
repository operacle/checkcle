import { SSLTranslations } from '../types/ssl';

export const sslTranslations: SSLTranslations = {
  // 页面和部分标题
  sslDomainManagement: "SSL与域名管理",
  monitorSSLCertificates: "监控和管理您域名的SSL证书",
  addSSLCertificate: "添加SSL证书",
  editSSLCertificate: "编辑SSL证书",
  deleteSSLCertificate: "删除SSL证书",
  sslCertificateDetails: "SSL证书详情",
  detailedInfo: "详细信息",

  // 状态相关
  valid: "有效",
  expiringSoon: "即将过期",
  expired: "已过期",
  pending: "待处理",

  // 统计和卡片
  validCertificates: "有效证书",
  expiringSoonCertificates: "即将过期",
  expiredCertificates: "已过期证书",

  // 表单字段
  domain: "域名",
  domainName: "域名",
  domainCannotChange: "创建后域名无法更改",
  warningThreshold: "警告阈值",
  warningThresholdDays: "警告阈值（天）",
  expiryThreshold: "过期阈值",
  expiryThresholdDays: "过期阈值（天）",
  notificationChannel: "通知渠道",
  chooseChannel: "选择通知渠道",
  whereToSend: "发送通知的位置",
  daysBeforeExpiration: "过期前多少天接收警告",
  daysBeforeCritical: "过期前多少天接收严重警报",
  getNotifiedExpiration: "在证书即将过期时获得通知",
  getNotifiedCritical: "在证书临近过期时获得严重警报",

  // 表格标题和字段
  issuer: "颁发者",
  expirationDate: "过期日期",
  daysLeft: "剩余天数",
  status: "状态",
  lastNotified: "最后通知",
  actions: "操作",
  validFrom: "有效期自",
  validUntil: "有效期至",
  validityDays: "有效天数",
  organization: "组织",
  commonName: "通用名称",
  serialNumber: "序列号",
  algorithm: "算法",
  subjectAltNames: "主题备用名称",
  
  // 按钮和操作
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
  
  // 详情视图中的部分
  basicInformation: "基本信息",
  validity: "有效性",
  issuerInfo: "颁发者信息",
  technicalDetails: "技术详情",
  monitoringConfig: "监控配置",
  recordInfo: "记录信息",
  
  // 通知和消息
  sslCertificateAdded: "SSL证书添加成功",
  sslCertificateUpdated: "SSL证书更新成功",
  sslCertificateDeleted: "SSL证书删除成功",
  sslCertificateRefreshed: "{domain}的SSL证书刷新成功",
  allCertificatesRefreshed: "所有{count}个证书刷新成功",
  someCertificatesFailed: "{success}个证书刷新成功，{failed}个失败",
  failedToAddCertificate: "添加SSL证书失败",
  failedToLoadCertificates: "加载SSL证书失败",
  failedToUpdateCertificate: "更新SSL证书失败",
  failedToDeleteCertificate: "删除SSL证书失败",
  failedToCheckCertificate: "检查SSL证书失败",
  noCertificatesToRefresh: "没有证书需要刷新",
  startingRefreshAll: "开始刷新{count}个证书",
  checkingSSLCertificate: "正在检查SSL证书...",
  deleteConfirmation: "您确定要删除以下域名的证书吗",
  deleteWarning: "此操作无法撤销。这将永久删除证书。",
  
  // 其他
  unknown: "未知",
  never: "从不",
  none: "无",
  loadingChannels: "加载渠道中...",
  noChannelsFound: "未找到通知渠道",
  noSSLCertificates: "未找到SSL证书",
  created: "创建时间",
  lastUpdated: "最后更新",
  lastNotification: "最后通知",
  collectionId: "集合ID"
};