import React, { useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertConfiguration, alertConfigService } from "@/services/alertConfigService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface NotificationChannelDialogProps {
  open: boolean;
  onClose: (refreshList: boolean) => void;
  editingConfig: AlertConfiguration | null;
}

const baseSchema = z.object({
  notify_name: z.string().min(1, "Name is required"),
  notification_type: z.enum(["telegram", "discord", "slack", "signal", "google_chat", "email", "ntfy", "pushover", "notifiarr", "gotify", "webhook"]),
  enabled: z.boolean().default(true),
  service_id: z.string().default("global"),
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
  signal_api_endpoint: z.string().url("Must be a valid API endpoint URL"),
});

const googleChatSchema = baseSchema.extend({
  notification_type: z.literal("google_chat"),
  google_chat_webhook_url: z.string().url("Must be a valid URL"),
});

const emailSchema = baseSchema.extend({
  notification_type: z.literal("email"),
  email_address: z.string().email("Valid email is required"),
  email_sender_name: z.string().min(1, "Sender name is required"),
  smtp_server: z.string().min(1, "SMTP server is required"),
  smtp_port: z.string().min(1, "SMTP port is required"),
  smtp_password: z.string().min(1, "SMTP password is required"),
});

const ntfySchema = baseSchema.extend({
  notification_type: z.literal("ntfy"),
  ntfy_endpoint: z.string().url("Must be a valid NTFY endpoint URL"),
});

const pushoverSchema = baseSchema.extend({
  notification_type: z.literal("pushover"),
  api_token: z.string().min(1, "API token is required"),
  user_key: z.string().min(1, "User key is required"),
});

const notifiarrSchema = baseSchema.extend({
  notification_type: z.literal("notifiarr"),
  api_token: z.string().min(1, "API token is required"),
  channel_id: z.string().min(1, "Channel ID is required"),
});

const webhookSchema = baseSchema.extend({
  notification_type: z.literal("webhook"),
  webhook_url: z.string().url("Must be a valid URL"),
  webhook_payload_template: z.string().optional(),
});

const gotifySchema = baseSchema.extend({
  notification_type: z.literal("gotify"),
  api_token: z.string().min(1, "API token is required"),
  server_url: z.string().url("Must be a valid server URL"),
});

const formSchema = z.discriminatedUnion("notification_type", [
  telegramSchema,
  discordSchema,
  slackSchema,
  signalSchema,
  googleChatSchema,
  emailSchema,
  ntfySchema,
  pushoverSchema,
  notifiarrSchema,
  gotifySchema,
  webhookSchema,
]);

type FormValues = z.infer<typeof formSchema>;

const notificationTypeOptions = [
  { 
    value: "telegram", 
    label: "Telegram", 
    description: "Send notifications via Telegram bot",
    icon: "/upload/notification/telegram.png"
  },
  { 
    value: "discord", 
    label: "Discord", 
    description: "Send notifications to Discord webhook",
    icon: "/upload/notification/discord.png"
  },
  { 
    value: "slack", 
    label: "Slack", 
    description: "Send notifications to Slack webhook",
    icon: "/upload/notification/slack.png"
  },
  { 
    value: "signal", 
    label: "Signal", 
    description: "Send notifications via Signal",
    icon: "/upload/notification/signal.png"
  },
  { 
    value: "google_chat", 
    label: "Google Chat", 
    description: "Send notifications to Google Chat webhook",
    icon: "/upload/notification/google.png"
  },
  { 
    value: "email", 
    label: "Email", 
    description: "Send notifications via email",
    icon: "/upload/notification/email.png"
  },
  { 
    value: "ntfy", 
    label: "NTFY", 
    description: "Send notifications via NTFY push service",
    icon: "/upload/notification/ntfy.png" 
  },
  { 
    value: "pushover", 
    label: "Pushover", 
    description: "Send push notifications via Pushover",
    icon: "/upload/notification/pushover.png" 
  },

  { 
    value: "notifiarr", 
    label: "Notifiarr", 
    description: "Send notifications via Notifiarr",
    icon: "/upload/notification/notifiarr.png" 
  },
  { 
    value: "gotify", 
    label: "Gotify", 
    description: "Send push notifications via Gotify",
    icon: "/upload/notification/gotify.png" 
  },
  { 
    value: "webhook", 
    label: "Webhook", 
    description: "Send notifications to custom webhook",
    icon: "/upload/notification/webhook.png"
  },
];

const webhookPayloadTemplates = {
  server: `{
  "alert_type": "server",
  "server_name": "\${server_name}",
  "status": "\${status}",
  "cpu_usage": "\${cpu_usage}",
  "ram_usage": "\${ram_usage}",
  "disk_usage": "\${disk_usage}",
  "network_usage": "\${network_usage}",
  "cpu_temp": "\${cpu_temp}",
  "disk_io": "\${disk_io}",
  "threshold": "\${time}",
  "message": "Server \${server_name} alert: \${status}"
}`,
  service: `{
  "alert_type": "service",
  "service_name": "\${service_name}",
  "status": "\${status}",
  "response_time": "\${response_time}",
  "url": "\${url}",
  "uptime": "\${uptime}",
  "downtime": "\${downtime}",
  "timestamp": "\${time}",
  "message": "Service \${service_name} is \${status}"
}`,
  ssl: `{
  "alert_type": "ssl",
  "domain": "\${domain}",
  "certificate_name": "\${certificate_name}",
  "expiry_date": "\${expiry_date}",
  "days_left": "\${days_left}",
  "issuer": "\${issuer}",
  "serial_number": "\${serial_number}",
  "timestamp": "\${time}",
  "message": "SSL certificate for \${domain} expires in \${days_left} days"
}`
};

const defaultPayloadTemplate = `{
  "alert_type": "general",
  "service_name": "\${service_name}",
  "status": "\${status}",
  "message": "\${message}",
  "timestamp": "\${time}"
}`;

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

  const { watch, reset, setValue } = form;
  const notificationType = watch("notification_type");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
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

  const insertTemplate = (template: string) => {
    setValue("webhook_payload_template", template);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Handle all notification types including webhook through alert_configurations
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification channel",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                  <FormLabel>Channel Name</FormLabel>
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
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {notificationTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={option.icon} 
                              alt={`${option.label} icon`}
                              className="w-5 h-5 object-contain"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      <FormDescription>
                        The Telegram chat ID to send notifications to
                      </FormDescription>
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
                      <FormDescription>
                        Your Telegram bot token from @BotFather
                      </FormDescription>
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
                      <Input placeholder="https://discord.com/api/webhooks/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Discord webhook URL from your server settings
                    </FormDescription>
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
                      <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Slack incoming webhook URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {notificationType === "signal" && (
               <>
                <FormField
                  control={form.control}
                  name="signal_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signal Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Signal phone number to send notifications to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="signal_api_endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signal API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-signal-api.com/v2/send" {...field} />
                      </FormControl>
                      <FormDescription>
                        The Rest API endpoint for your Signal service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {notificationType === "google_chat" && (
              <FormField
                control={form.control}
                name="google_chat_webhook_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Chat Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://chat.googleapis.com/v1/spaces/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Google Chat webhook URL from your Google Chat space
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {notificationType === "email" && (
              <>
                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="notifications@example.com" {...field} type="email" />
                      </FormControl>
                      <FormDescription>
                        Email address to send notifications to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_sender_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alert System" {...field} />
                      </FormControl>
                      <FormDescription>
                        Display name for outgoing emails
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="smtp_server"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Server</FormLabel>
                        <FormControl>
                          <Input placeholder="smtp.gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input placeholder="587" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="smtp_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your SMTP password" {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Password for authenticating with the SMTP server
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

             {notificationType === "ntfy" && (
              <FormField
                control={form.control}
                name="ntfy_endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NTFY Endpoint</FormLabel>
                    <FormControl>
                      <Input placeholder="https://ntfy.sh/your-topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      The NTFY endpoint URL including your topic (e.g., https://ntfy.sh/checkcle)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

             {notificationType === "pushover" && (
              <>
                <FormField
                  control={form.control}
                  name="api_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Pushover API token" {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Your Pushover application API token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Pushover user key" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Pushover user key (or group key)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

             {notificationType === "notifiarr" && (
              <>
                <FormField
                  control={form.control}
                  name="api_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Notifiarr API token" {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Your Notifiarr API token for sending notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="channel_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Discord Channel ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        The Discord channel ID where notifications will be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {notificationType === "gotify" && (
              <>
                <FormField
                  control={form.control}
                  name="api_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Gotify API token" {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Your Gotify application API token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="server_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-gotify-server.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL of your Gotify server
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {notificationType === "webhook" && (
              <>
                <FormField
                  control={form.control}
                  name="webhook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://api.example.com/webhook" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL where webhook notifications will be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="webhook_payload_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payload Template (Optional)</FormLabel>
                       
                        <FormDescription>
                          JSON template for the webhook payload. Leave empty to use default template.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Payload Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Available Placeholders:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">Server:</p>
                              <div className="space-y-0.5">
                                <code className="bg-muted px-1 rounded">${'{server_name}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{cpu_usage}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{ram_usage}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{disk_usage}'}</code>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">Service:</p>
                              <div className="space-y-0.5">
                                <code className="bg-muted px-1 rounded">${'{service_name}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{response_time}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{url}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{uptime}'}</code>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">SSL:</p>
                              <div className="space-y-0.5">
                                <code className="bg-muted px-1 rounded">${'{domain}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{expiry_date}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{days_left}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{issuer}'}</code>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-muted-foreground">Common:</p>
                              <div className="space-y-0.5">
                                <code className="bg-muted px-1 rounded">${'{status}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{time}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{message}'}</code><br/>
                                <code className="bg-muted px-1 rounded">${'{threshold}'}</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                      Enable or disable this notification channel
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
                {isEditing ? "Update Channel" : "Create Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};