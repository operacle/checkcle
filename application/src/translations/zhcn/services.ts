
import { ServicesTranslations } from '../types/services';

export const servicesTranslations: ServicesTranslations = {
  serviceStatus: "服务状态",
  uptime: "在线时间",
  lastChecked: "最后检查时间",
  noServices: "没有符合您筛选条件的服务。",
  currentlyMonitoring: "当前监控",
  retry: "重试",
  overview: "概览",
  newService: "新增服务",
  rowsPerPage: "每页行数",
  search: "搜索",
  allTypes: "所有类型",
  createNewService: "添加新服务",
  createNewServiceDesc: "填写详细信息以创建要监控的新服务。",

	// ServiceBasicFields.tsx
	serviceName: "服务名称",
	serviceNameDesc: "为你的服务输入一个描述性名称",

	// ServiceConfigFields.tsx
	checkInterval: "检查间隔",
	seconds: "秒",
	minute: "分钟",
	minutes: "分钟",
	hour: "小时",
	hours: "小时",
	custom: "自定义",
	checkIntervalPlaceholder: "输入间隔时间（秒）",
	backToPresets: "回到预设",
	checkIntervalDesc: "多久检查一次服务状态",
	checkIntervalDescCustom: "输入自定义间隔时间（以秒为单位，最小10秒）",
	retryAttempts: "重试次数",
	attempt: "次",
	attempts: "次",
	retryAttemptsDesc: "在标记为下线之前重试的次数",

	// ServiceForm.tsx
	updateService: "更新服务",
	createService: "创建服务",

	// ServiceNotificationFields.tsx
	enableNotifications: "启用通知",
	enableNotificationsDesc: "为本服务启用或禁用通知",
	notificationChannels: "通知渠道",
	notificationChannelsEnabledDesc: "为本服务选择通知渠道",
	notificationChannelsDesc: "先启用通知以选择渠道",
	notificationChannelsPlaceholder: "添加一个通知渠道",
	alertTemplate: "警报模板",
	alertTemplateLoading: "正在加载模板...",
	alertTemplatePlaceholder: "选择一个警报模板",
	alertTemplateEnabledDesc: "选择一个警报消息的模板",
	alertTemplateDesc: "先启用通知才能选择模板",

	// ServiceTypeField.tsx
	serviceType: "服务类型",
	serviceTypeHTTPDesc: "使用 HTTP/HTTPS 协议监控网站和 RESTAPI",
	serviceTypePINGDesc: "使用 PING 协议监控主机可用性",
	serviceTypeTCPDesc: "使用 TCP 协议监控 TCP 端口连接性",
	serviceTypeDNSDesc: "监控 DNS 解析",

	// ServiceRegionalFields.tsx
	regionalMonitoring: "区域监控",
	regionalMonitoringDesc: "将此服务分配给区域监控代理以进行分布式监控",
	regionalAgents: "区域代理",
	regionalAgentsLoading: "加载代理中...",
	regionalAgentsAvailablePlaceholder: "选择额外的区域代理...",
	regionalAgentsAllSelected: "已选择所有可用代理",
	regionalAgentsNoAvailable: "无可用区域代理",
	regionalAgentsNoOnlineAvailable: "无可用在线区域代理",
	regionalAgentsNotFoundMessage: "未找到在线区域代理。服务将使用默认监控。",
	regionalAgentsNotSelectedMessage: "未选择区域代理。服务将使用默认监控。",

	// ServiceUrlField.tsx
	targetDefault: "目标 URL/Host",
	targetDNS: "域名",
	targetHTTPDesc: "输入完整的 URL，包括协议（http:// 或 https://）",
	targetPINGDesc: "输入要 ping 的主机名或 IP 地址",
	targetTCPDesc: "输入主机名或 IP 地址以进行 TCP 连接测试",
	targetTCPPortDesc: "输入用于 TCP 连接测试的端口号",
	targetDNSDesc: "输入要监控的 DNS 记录域名（A、AAAA、MX等）",
	targetDefaultDesc: "输入要监控的目标 URL 或主机名",
	targetDefaultPlaceholder: "输入 URL 或主机名",

	// types.ts
	serviceNameRequired: "服务名称是必填项",
	urlDomainHostRequired: "URL/域名/主机名是必填项",
	enterValidUrlHostnameDomain: "请输入有效的URL、主机名或域名",

	// Dashboard
	upServices: "在线服务",
	downServices: "下线服务",
	pausedServices: "暂停服务",
	warningServices: "告警服务",

	// ServiceRowActions.tsx
	viewDetail: "查看详情",
	resumeMonitoring: "恢复监控",
	pauseMonitoring: "暂停监控",
	unmuteAlerts: "取消静音警报",
	muteAlerts: "静音警报",

	//IncidentTable.tsx
	responseTime: "响应时间",
	errorMessage: "错误信息",
	details: "详情",

	//LastCheckedTime.tsx
	pausedAt: "暂停于 ",
	lastCheckDetails: "最近检查详情",
	checkedAt: "检查于 ",
	monitoringPaused: "监控已暂停",
	noAutomaticChecks: "无自动检查",

	//ServiveEditDialog.tsx
	editService: "编辑服务",
	editServiceDesc: "更新您所监控服务的详细信息。",

	//ServiceStatsCards.tsx
	lastCheckedAt: "最新检查时间 {datetime}",
	avg: "平均",
	lastUpChecksCount: "最近 {count} 次检查",
	basedOnlastChecksCount: "基于最近的 {count} 次检查",
	totalUptime: "总在线时间",
	totalDowntime: "总宕机时间",
	monitoringSettings: "监控设置",
	monitoringSettingsInterval: "每 {interval} 秒检查一次",
	monitoringSettingsType: "监控",
	upStatusDuration: "已在线 {duration}",
	downStatusDuration: "已宕机 {duration}",

	incidentHistory: "事件历史",
	processing: "处理中",
	back: "返回",
	last20Checks: "最近 20 次检查",
};