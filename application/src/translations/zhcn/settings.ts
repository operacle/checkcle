
import { SettingsTranslations } from '../types/settings';

export const settingsTranslations: SettingsTranslations = {
	// General Settings - Tabs
  systemSettings: "系统设置",
  mailSettings: "邮件设置",
  
	// General Settings - System Settings
  appName: "应用名称",
  appURL: "应用 URL",
  senderName: "发送者名称",
  senderEmail: "发送者邮箱地址",
  hideControls: "隐藏控件",
  
	// General Settings - Mail Settings
  smtpSettings: "SMTP 配置",
  smtpEnabled: "启用 SMTP",
  smtpHost: "SMTP 主机",
  smtpPort: "SMTP 端口",
  smtpUsername: "SMTP 用户名",
  smtpPassword: "SMTP 密码",
  smtpAuthMethod: "认证方法",
  enableTLS: "启用 TLS",
  localName: "本地名称",
  
	// General Settings - Test Email
  testEmail: "测试邮箱",
  sendTestEmail: "发送测试邮箱",
  emailTemplate: "邮箱模板",
  verification: "验证",
  passwordReset: "密码重置",
  confirmEmailChange: "确认邮箱变更",
  otp: "OTP",
  loginAlert: "登录警报",
  authCollection: "认证集合",
  selectCollection: "选择集合",
  toEmailAddress: "收件人邮箱地址",
  enterEmailAddress: "输入收件人邮箱地址",
	send: "发送",
  sending: "发送中...",
	testEmailSettings: "测试邮箱配置",
	testEmailDescription: "测试当前的邮箱设置是否可用",
	testEmailAlert: "这将使用您配置的SMTP设置发送一封测试邮件。请确保SMTP已正确配置。",

	// General Settings - Actions and status
  save: "保存变更",
  saving: "保存中...",
  settingsUpdated: "设置已成功更新",
  errorSavingSettings: "保存设置时出错",
  errorFetchingSettings: "加载设置时出错",
  testConnection: "测试连接",
  testingConnection: "测试连接中...",
  connectionSuccess: "连接成功",
  connectionFailed: "连接失败",

	// User Management
	addUser: "添加用户",
	permissionNotice: "权限问题：",
	permissionNoticeAddUser: "作为管理员用户，您无权查看或修改系统及邮件设置。这些设置仅超级管理员可访问和修改。如需更改系统配置或邮件设置，请联系您的超级管理员。",
	loadingSettings: "加载设置中...",
	loadingSettingsError: "加载设置时出错",
};