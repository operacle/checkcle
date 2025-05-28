
import React from 'react';
import { Input } from "@/components/ui/input";
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
                    placeholder="https://pb-api.k8sops.asia"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;