import { SettingsTranslations } from '../types/settings';

export const settingsTranslations: SettingsTranslations = {
  // 标签页
  systemSettings: "系统设置",
  mailSettings: "邮件设置",
  
  // 系统设置
  appName: "应用名称",
  appURL: "应用URL",
  senderName: "发件人名称",
  senderEmail: "发件人邮箱地址",
  hideControls: "隐藏控件",
  
  // 邮件设置
  smtpSettings: "SMTP配置",
  smtpEnabled: "启用SMTP",
  smtpHost: "SMTP主机",
  smtpPort: "SMTP端口",
  smtpUsername: "SMTP用户名",
  smtpPassword: "SMTP密码",
  smtpAuthMethod: "认证方式",
  enableTLS: "启用TLS",
  localName: "本地名称",
  
  // 测试邮件
  testEmail: "测试邮件",
  sendTestEmail: "发送测试邮件",
  emailTemplate: "邮件模板",
  verification: "验证",
  passwordReset: "密码重置",
  confirmEmailChange: "确认邮箱变更",
  otp: "一次性密码",
  loginAlert: "登录提醒",
  authCollection: "认证集合",
  selectCollection: "选择集合",
  toEmailAddress: "收件人邮箱地址",
  enterEmailAddress: "输入邮箱地址",
  sending: "发送中...",
  
  // 操作和状态
  save: "保存更改",
  saving: "保存中...",
  settingsUpdated: "设置更新成功",
  errorSavingSettings: "保存设置时出错",
  errorFetchingSettings: "加载设置时出错",
  testConnection: "测试连接",
  testingConnection: "测试连接中...",
  connectionSuccess: "连接成功",
  connectionFailed: "连接失败"
};