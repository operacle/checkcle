
import React from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { SettingsTabProps } from "./types";

const SystemSettingsTab: React.FC<SettingsTabProps> = ({ form, isEditing, settings }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={form.control}
            name="meta.appName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  {t("appName", "settings")} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing}
                    placeholder="CheckCle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                    value={field.value || settings?.system_name || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormField
            control={form.control}
            name="meta.appURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  {t("appURL", "settings")} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing}
                    placeholder="https://localhost:8090"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div>
        <FormField
          control={form.control}
          name="meta.senderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                {t("senderName", "settings")}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!isEditing}
                  placeholder="System Administrator"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
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
              <FormLabel className="text-sm font-medium text-foreground">
                {t("senderEmail", "settings")}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={!isEditing}
                  placeholder="admin@example.com"
                  type="email"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex items-center space-x-3 pt-4">
        <FormField
          control={form.control}
          name="meta.hideControls"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                {t("hideControls", "settings")}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SystemSettingsTab;