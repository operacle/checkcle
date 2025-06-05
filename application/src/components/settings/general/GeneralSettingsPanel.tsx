import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail, ShieldAlert } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { GeneralSettings } from "@/services/settingsService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import SystemSettingsTab from './SystemSettingsTab';
import MailSettingsTab from './MailSettingsTab';
import { GeneralSettingsPanelProps } from './types';

const GeneralSettingsPanel: React.FC<GeneralSettingsPanelProps> = () => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("system");
  
  // Get current user to check permissions
  const currentUser = authService.getCurrentUser();
  const isSuperAdmin = currentUser?.role === "superadmin";
  
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating,
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
        password: '',
        authMethod: '',
        tls: true,
        localName: ''
      }
    }
  });

  useEffect(() => {
    if (settings && isSuperAdmin) {
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
          password: '',
          authMethod: '',
          tls: true,
          localName: ''
        }
      });
    }
  }, [settings, form, isSuperAdmin]);

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
          password: '',
          authMethod: '',
          tls: true,
          localName: ''
        }
      });
    }
  };

  // Show permission notice for admin users
  if (!isSuperAdmin) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("generalSettings", "menu")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Permission Notice:</span> As an admin user, you do not have access to view or modify system and mail settings. These settings can only be accessed and modified by Super Admins. Contact your Super Admin if you need to make changes to system configuration or mail settings.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  />
                </TabsContent>
              </Tabs>
              
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