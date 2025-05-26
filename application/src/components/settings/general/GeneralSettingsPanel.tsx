
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { GeneralSettings } from "@/services/settingsService";
import SystemSettingsTab from './SystemSettingsTab';
import MailSettingsTab from './MailSettingsTab';
import { GeneralSettingsPanelProps } from './types';

const GeneralSettingsPanel: React.FC<GeneralSettingsPanelProps> = () => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("system");
  
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating,
    testEmailConnection,
    isTestingConnection
  } = useSystemSettings();

  const form = useForm<GeneralSettings>({
    defaultValues: {
      meta: {
        appName: '',
        appURL: '',
        senderName: '',
        senderAddress: '',
        hideControls: false
      },
      smtp: {
        enabled: false,
        port: 587,
        host: '',
        username: '',
        authMethod: '',
        tls: true,
        localName: ''
      }
    }
  });

  useEffect(() => {
    if (settings) {
      // Initialize form with existing settings, using system_name for appName if meta.appName is not set
      const appName = settings.meta?.appName || settings.system_name || '';
      
      form.reset({
        ...settings,
        meta: {
          appName: appName,
          appURL: settings.meta?.appURL || '',
          senderName: settings.meta?.senderName || '',
          senderAddress: settings.meta?.senderAddress || '',
          hideControls: settings.meta?.hideControls || false
        },
        smtp: settings.smtp || {
          enabled: false,
          port: 587,
          host: '',
          username: '',
          authMethod: '',
          tls: true,
          localName: ''
        }
      });
    }
  }, [settings, form]);

  const handleSave = async (formData: GeneralSettings) => {
    try {
      // Prepare data for PocketBase settings update (no ID needed)
      const dataToSave = {
        ...formData,
        system_name: formData.meta?.appName || settings?.system_name
      };
      
      console.log('Saving settings data:', dataToSave);
      await updateSettings(dataToSave);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleTestConnection = async () => {
    try {
      const smtpConfig = form.getValues('smtp');
      await testEmailConnection(smtpConfig);
    } catch (error) {
      console.error("Error testing connection:", error);
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked, setting isEditing to true');
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    console.log('Cancel button clicked, setting isEditing to false');
    setIsEditing(false);
    // Reset form to original values
    if (settings) {
      const appName = settings.meta?.appName || settings.system_name || '';
      form.reset({
        ...settings,
        meta: {
          appName: appName,
          appURL: settings.meta?.appURL || '',
          senderName: settings.meta?.senderName || '',
          senderAddress: settings.meta?.senderAddress || '',
          hideControls: settings.meta?.hideControls || false
        },
        smtp: settings.smtp || {
          enabled: false,
          port: 587,
          host: '',
          username: '',
          authMethod: '',
          tls: true,
          localName: ''
        }
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading settings</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("generalSettings", "menu")}</CardTitle>
          <CardDescription>
            {t("monitorSSLCertificates", "ssl")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="system" className="flex items-center gap-2 flex-1">
                    <Settings className="h-4 w-4" />
                    {t("systemSettings", "settings")}
                  </TabsTrigger>
                  <TabsTrigger value="mail" className="flex items-center gap-2 flex-1">
                    <Mail className="h-4 w-4" />
                    {t("mailSettings", "settings")}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="system">
                  <SystemSettingsTab 
                    form={form} 
                    isEditing={isEditing} 
                    settings={settings} 
                  />
                </TabsContent>
                
                <TabsContent value="mail">
                  <MailSettingsTab 
                    form={form} 
                    isEditing={isEditing} 
                    settings={settings}
                    handleTestConnection={handleTestConnection}
                    isTestingConnection={isTestingConnection}
                  />
                </TabsContent>
              </Tabs>
              
              {/* Save and Cancel buttons - only show when editing */}
              {isEditing && (
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isUpdating}>
                    {t("cancel", "common")}
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? t("saving", "settings") : t("save", "settings")}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        
        {/* Edit button - only show when not editing and outside the form */}
        {!isEditing && (
          <CardFooter>
            <Button type="button" onClick={handleEditClick}>
              {t("edit", "common")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default GeneralSettingsPanel;