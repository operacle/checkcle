
import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertConfiguration, alertConfigService } from "@/services/alertConfigService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2, MessageSquare } from "lucide-react";
import TestWecomDialog from "./TestWecomDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationChannelDialogProps {
  open: boolean;
  onClose: (refreshList: boolean) => void;
  editingConfig: AlertConfiguration | null;
}

const baseSchema = z.object({
  notify_name: z.string().min(1, "Name is required"),
  notification_type: z.enum(["telegram", "discord", "slack", "signal", "email", "wecom"]),
  enabled: z.boolean().default(true),
  service_id: z.string().default("global"), // Assuming global for now, could be linked to specific services
  template_id: z.string().optional(),
});

const telegramSchema = baseSchema.extend({
  notification_type: z.literal("telegram"),
  telegram_chat_id: z.string().min(1, "Chat ID is required"),
  bot_token: z.string().min(1, "Bot token is required"),
});

const discordSchema = baseSchema.extend({
  notification_type: z.literal("discord"),
  discord_webhook_url: z.string().url("Must be a valid URL"),
});

const slackSchema = baseSchema.extend({
  notification_type: z.literal("slack"),
  slack_webhook_url: z.string().url("Must be a valid URL"),
});

const signalSchema = baseSchema.extend({
  notification_type: z.literal("signal"),
  signal_number: z.string().min(1, "Signal number is required"),
});

const emailSchema = baseSchema.extend({
  notification_type: z.literal("email"),
  // Email specific fields could be added here
});

const wecomSchema = baseSchema.extend({
  notification_type: z.literal("wecom"),
  wecom_webhook_url: z.string().url("Must be a valid URL"),
});

const formSchema = z.discriminatedUnion("notification_type", [
  telegramSchema,
  discordSchema,
  slackSchema,
  signalSchema,
  emailSchema,
  wecomSchema
]);

type FormValues = z.infer<typeof formSchema>;

export const NotificationChannelDialog = ({ 
  open, 
  onClose,
  editingConfig 
}: NotificationChannelDialogProps) => {
  const isEditing = !!editingConfig;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notify_name: "",
      notification_type: "telegram" as const,
      enabled: true,
      service_id: "global",
      template_id: "",
    },
  });

  const { watch, reset } = form;
  const notificationType = watch("notification_type");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showTestWecomDialog, setShowTestWecomDialog] = useState(false);
  const { language } = useLanguage();
  
  useEffect(() => {
    if (editingConfig) {
      // Handle string vs boolean for enabled field
      const enabled = typeof editingConfig.enabled === 'string' 
        ? editingConfig.enabled === "true" 
        : !!editingConfig.enabled;

      reset({
        ...editingConfig,
        enabled
      });
    } else if (open) {
      reset({
        notify_name: "",
        notification_type: "telegram" as const,
        enabled: true,
        service_id: "global",
        template_id: "",
      });
    }
  }, [editingConfig, open, reset]);

  const handleClose = () => {
    onClose(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure service_id is always present
      const configData = {
        ...values,
        service_id: values.service_id || "global",
      };
      
      if (isEditing && editingConfig?.id) {
        await alertConfigService.updateAlertConfiguration(editingConfig.id, configData);
      } else {
        await alertConfigService.createAlertConfiguration(configData as any);
      }
      onClose(true); // Close with refresh
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Notification Channel" : "Add Notification Channel"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notify_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Notification Channel" {...field} />
                  </FormControl>
                  <FormDescription>
                    A name to identify this notification channel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Channel Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="telegram" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Telegram
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="discord" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Discord
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="slack" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Slack
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="signal" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Signal
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="email" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Email
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="wecom" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {language === "zh-CN" ? "企业微信" : "Wecom"}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Show different fields based on notification type */}
            {notificationType === "telegram" && (
              <>
                <FormField
                  control={form.control}
                  name="telegram_chat_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Telegram Chat ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bot_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Telegram Bot Token" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {notificationType === "discord" && (
              <FormField
                control={form.control}
                name="discord_webhook_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Discord Webhook URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {notificationType === "slack" && (
              <FormField
                control={form.control}
                name="slack_webhook_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Slack Webhook URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {notificationType === "signal" && (
              <FormField
                control={form.control}
                name="signal_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signal Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {notificationType === "wecom" && (
              <>
                <FormField
                  control={form.control}
                  name="wecom_webhook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input placeholder={language === "zh-CN" ? "企业微信机器人Webhook URL" : "Wecom Bot Webhook URL"} {...field} />
                      </FormControl>
                      <FormDescription>
                        {language === "zh-CN" ? "在企业微信群聊中添加机器人，获取Webhook URL" : "Add a bot in Wecom group chat to get the Webhook URL"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEditing && editingConfig && editingConfig.wecom_webhook_url && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 mt-2"
                    onClick={() => setShowTestWecomDialog(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {language === "zh-CN" ? "发送测试消息" : "Send Test Message"}
                  </Button>
                )}
              </>
            )}
            
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Enabled</FormLabel>
                    <FormDescription>
                      Turn notifications on or off
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* 测试企业微信通知对话框 */}
      <TestWecomDialog
        open={showTestWecomDialog}
        onOpenChange={setShowTestWecomDialog}
        config={editingConfig}
      />
    </Dialog>
  );
};
