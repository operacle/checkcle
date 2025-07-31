
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { AlertConfiguration, alertConfigService } from "@/services/alertConfigService";
import { NotificationChannelDialog } from "./NotificationChannelDialog";
import { NotificationChannelList } from "./NotificationChannelList";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [editingConfig, setEditingConfig] = useState<AlertConfiguration | null>(null);
  const { language } = useLanguage();

  const fetchAlertConfigurations = async () => {
    setIsLoading(true);
    try {
      const configs = await alertConfigService.getAlertConfigurations();
      setAlertConfigs(configs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertConfigurations();
  }, []);

  const handleAddNew = () => {
    setEditingConfig(null);
    setDialogOpen(true);
  };

  const handleEdit = (config: AlertConfiguration) => {
    setEditingConfig(config);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await alertConfigService.deleteAlertConfiguration(id);
    if (success) {
      fetchAlertConfigurations();
    }
  };

  const handleDialogClose = (refreshList: boolean) => {
    setDialogOpen(false);
    if (refreshList) {
      fetchAlertConfigurations();
    }
  };

  const getFilteredConfigs = () => {
    if (currentTab === "all") return alertConfigs;
    return alertConfigs.filter(config => config.notification_type === currentTab);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure notification channels for your services
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Channel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="all" 
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Channels</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="discord">Discord</TabsTrigger>
            <TabsTrigger value="slack">Slack</TabsTrigger>
            <TabsTrigger value="signal">Signal</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="wecom">{language === "zh-CN" ? "企业微信" : "Wecom"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <NotificationChannelList 
                channels={getFilteredConfigs()} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <NotificationChannelDialog 
        open={dialogOpen} 
        onClose={handleDialogClose} 
        editingConfig={editingConfig}
      />
    </Card>
  );
};

export default NotificationSettings;
