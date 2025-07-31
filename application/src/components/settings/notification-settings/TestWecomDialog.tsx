import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, AlertCircle, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertConfiguration } from "@/services/alertConfigService";
import { testSendWecomMessage } from "@/services/notification/wecomService";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestWecomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AlertConfiguration | null;
}

const TestWecomDialog: React.FC<TestWecomDialogProps> = ({
  open,
  onOpenChange,
  config
}) => {
  const { language } = useLanguage();
  const [serviceName, setServiceName] = useState(language === "zh-CN" ? '测试服务' : 'Test Service');
  const [isTesting, setIsTesting] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSend = async () => {
    if (!config) {
      toast({
        title: language === "zh-CN" ? "配置错误" : "Configuration Error",
        description: language === "zh-CN" ? "无法获取企业微信配置信息" : "Unable to get Wecom configuration",
        variant: "destructive",
      });
      return;
    }
    
    if (!config.wecom_webhook_url) {
      toast({
        title: language === "zh-CN" ? "配置错误" : "Configuration Error",
        description: language === "zh-CN" ? "请先设置企业微信 Webhook URL" : "Please set Wecom Webhook URL first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLastResult(null);
      setIsTesting(true);
      
      console.log(language === "zh-CN" ? '发送企业微信测试消息:' : 'Sending Wecom test message:', {
        serviceName,
        webhookUrl: config.wecom_webhook_url ? (language === "zh-CN" ? "[已隐藏]" : "[hidden]") : undefined
      });
      
      const result = await testSendWecomMessage(config, serviceName);
      
      if (result) {
        setLastResult({
          success: true,
          message: language === "zh-CN" ? `测试消息已成功发送到企业微信` : `Test message has been successfully sent to Wecom`
        });
        
        toast({
          title: language === "zh-CN" ? "发送成功" : "Send Success",
          description: language === "zh-CN" ? `测试消息已成功发送到企业微信` : `Test message has been successfully sent to Wecom`,
          variant: "default",
        });
      } else {
        setLastResult({
          success: false,
          message: language === "zh-CN" ? "发送测试消息失败，请检查配置和网络连接" : "Failed to send test message, please check configuration and network connection"
        });
        
        toast({
          title: language === "zh-CN" ? "发送失败" : "Send Failed",
          description: language === "zh-CN" ? "发送测试消息失败，请检查配置和网络连接" : "Failed to send test message, please check configuration and network connection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(language === "zh-CN" ? '发送企业微信测试消息出错:' : 'Error sending Wecom test message:', error);
      const errorMessage = error instanceof Error ? error.message : (language === "zh-CN" ? "发送测试消息失败" : "Failed to send test message");
      
      setLastResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: language === "zh-CN" ? "错误" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // 重置表单但保留上次结果以供参考
    setServiceName(language === "zh-CN" ? '测试服务' : 'Test Service');
    // 不立即重置lastResult，以便用户查看结果
    setTimeout(() => setLastResult(null), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {language === "zh-CN" ? "发送企业微信测试消息" : "Send Wecom Test Message"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
            disabled={isTesting}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 显示上次结果 */}
          {lastResult && (
            <Alert variant={lastResult.success ? "default" : "destructive"}>
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {lastResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* 服务名称 */}
          <div className="space-y-2">
            <Label>{language === "zh-CN" ? "服务名称" : "Service Name"}</Label>
            <Input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder={language === "zh-CN" ? "输入服务名称" : "Enter service name"}
              disabled={isTesting}
            />
          </div>

          {/* 信息提示 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {language === "zh-CN" 
                ? "这将使用您配置的企业微信 Webhook URL 发送测试消息。请确保已正确配置企业微信机器人。" 
                : "This will send a test message using the Wecom Webhook URL you configured. Please ensure the Wecom bot is correctly configured."}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose} disabled={isTesting}>
            {language === "zh-CN" ? "关闭" : "Close"}
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!config?.wecom_webhook_url || isTesting}
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            {isTesting 
              ? (language === "zh-CN" ? "发送中..." : "Sending...") 
              : (language === "zh-CN" ? "发送测试消息" : "Send Test Message")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestWecomDialog;