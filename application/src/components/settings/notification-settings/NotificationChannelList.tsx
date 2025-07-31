
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
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationChannelListProps {
  channels: AlertConfiguration[];
  onEdit: (config: AlertConfiguration) => void;
  onDelete: (id: string) => void;
}

export const NotificationChannelList = ({
  channels,
  onEdit,
  onDelete
}: NotificationChannelListProps) => {
  const { language } = useLanguage();
  const toggleEnabled = async (config: AlertConfiguration) => {
    if (!config.id) return;
    
    await alertConfigService.updateAlertConfiguration(config.id, {
      enabled: !config.enabled
    });
    
    // The parent component will refresh the list
    onEdit(config);
  };

  const getChannelTypeLabel = (type: string) => {
    switch(type) {
      case "telegram": return "Telegram";
      case "discord": return "Discord";
      case "slack": return "Slack";
      case "signal": return "Signal";
      case "email": return "Email";
      case "wecom": return language === "zh-CN" ? "企业微信" : "Wecom";
      default: return type;
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
              <TableCell>
                <Switch 
                  checked={
                    typeof channel.enabled === 'string'
                      ? channel.enabled === "true"
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
                    onClick={() => onEdit(channel)}
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
