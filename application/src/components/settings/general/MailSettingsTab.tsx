

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { SettingsTabProps } from "./types";
import TestEmailDialog, { TestEmailData } from "./TestEmailDialog";
import { Mail } from "lucide-react";

interface MailSettingsTabProps extends SettingsTabProps {
  // Remove handleTestConnection and isTestingConnection props since we're removing the test connection button
}

const MailSettingsTab: React.FC<MailSettingsTabProps> = ({
  form,
  isEditing
}) => {
  const { t } = useLanguage();
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleTestEmail = async (data: TestEmailData) => {
    try {
      setIsTestingEmail(true);
      console.log('Testing email with data:', data);
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendTestEmail',
          data: {
            email: data.email,
            template: data.template,
            ...(data.collection && { collection: data.collection })
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Test email failed');
      }

      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error; // Re-throw to let the dialog handle the error display
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormField
          control={form.control}
          name="meta.senderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("senderName", "settings")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!isEditing}
                  placeholder="Support"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div>
        <FormField
          control={form.control}
          name="meta.senderAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("senderEmail", "settings")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!isEditing}
                  placeholder="support@example.com"
                  type="email"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    
      <div className="flex items-center space-x-2 mb-4">
        <FormField
          control={form.control}
          name="smtp.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormLabel className="mt-0">{t("smtpEnabled", "settings")}</FormLabel>
            </FormItem>
          )}
        />
      </div>
      
      <div className={!form.watch('smtp.enabled') ? 'opacity-50' : ''}>
        <div>
          <FormField
            control={form.control}
            name="smtp.host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("smtpHost", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="smtp.example.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="smtp.port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("smtpPort", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 587)} 
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="587"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="smtp.username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("smtpUsername", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="user@example.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="smtp.password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("smtpPassword", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password"
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="••••••••"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="smtp.authMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("smtpAuthMethod", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="Login"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <FormField
            control={form.control}
            name="smtp.tls"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                  />
                </FormControl>
                <FormLabel className="mt-0">{t("enableTLS", "settings")}</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="smtp.localName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("localName", "settings")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || !form.watch('smtp.enabled')}
                    placeholder="localhost"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        {/* Only show Test Email button, removed Test Connection button */}
        {isEditing && form.watch('smtp.enabled') && (
          <div className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowTestEmailDialog(true)}
              disabled={isTestingEmail}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {t("testEmail", "settings")}
            </Button>
          </div>
        )}
      </div>

      <TestEmailDialog
        open={showTestEmailDialog}
        onOpenChange={setShowTestEmailDialog}
        onSendTest={handleTestEmail}
        isTesting={isTestingEmail}
      />
    </div>
  );
};

export default MailSettingsTab;
