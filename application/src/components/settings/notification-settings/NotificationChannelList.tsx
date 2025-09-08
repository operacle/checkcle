
import { AlertConfiguration } from "@/services/alertConfigService";
import { Bell, Edit, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { alertConfigService } from "@/services/alertConfigService";
import { pb } from "@/lib/pocketbase";

interface CombinedChannel extends Partial<AlertConfiguration> {
  isWebhook?: boolean;
  url?: string;
  method?: string;
  description?: string;
}

interface NotificationChannelListProps {
  channels: CombinedChannel[];
  onEdit: (config: AlertConfiguration) => void;
  onDelete: (id: string) => void;
}

export const NotificationChannelList = ({
  channels,
  onEdit,
  onDelete
}: NotificationChannelListProps) => {
  const toggleEnabled = async (config: CombinedChannel) => {
    if (!config.id) return;
    
    if (config.isWebhook) {
      // Handle webhook toggle
      try {
        const newEnabled = config.enabled ? "off" : "on";
        await pb.collection('webhook').update(config.id, {
          enabled: newEnabled
        });
        // Trigger refresh by calling onEdit with empty config
        onEdit({} as AlertConfiguration);
      } catch (error) {
        console.error("Error updating webhook:", error);
      }
    } else {
      // Handle alert config toggle
      await alertConfigService.updateAlertConfiguration(config.id, {
        enabled: !config.enabled
      });
      
      // The parent component will refresh the list
      onEdit(config as AlertConfiguration);
    }
  };

  const getChannelTypeLabel = (type: string | undefined) => {
    switch(type) {
      case "telegram": return "Telegram";
      case "discord": return "Discord";
      case "slack": return "Slack";
      case "signal": return "Signal";
      case "google_chat": return "Google Chat";
      case "email": return "Email";
      case "pushover": return "Pushover";
      case "notifiarr": return "Notifiarr";
      case "webhook": return "Webhook";
      default: return type || "Unknown";
    }
  };

  const getChannelDetails = (config: CombinedChannel) => {
    if (config.isWebhook) {
      return `${config.method || 'POST'} ${config.url || ''}`;
    }
    
    switch(config.notification_type) {
      case "telegram":
        return config.telegram_chat_id || '';
      case "discord":
      case "slack":
      case "google_chat":
        return config.discord_webhook_url || config.slack_webhook_url || config.google_chat_webhook_url || '';
      case "signal":
        return config.signal_number || '';
      case "email":
        return config.email_address || '';
      default:
        return '';
    }
  };

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notification channels configured</h3>
        <p className="text-muted-foreground mt-2">
          Add a notification channel to get alerts when your services go down.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels.map((channel) => (
            <TableRow key={channel.id}>
              <TableCell className="font-medium">{channel.notify_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{getChannelTypeLabel(channel.notification_type)}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                {getChannelDetails(channel)}
              </TableCell>
              <TableCell>
                <Switch 
                  checked={
                    typeof channel.enabled === 'string'
                      ? channel.enabled === "true" || channel.enabled === "on"
                      : !!channel.enabled
                  }
                  onCheckedChange={() => toggleEnabled(channel)}
                />
              </TableCell>
              <TableCell>
                {channel.created ? new Date(channel.created).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(channel as AlertConfiguration)}
                    disabled={channel.isWebhook} // Disable edit for webhooks for now
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (channel.id && confirm("Are you sure you want to delete this notification channel?")) {
                        onDelete(channel.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};