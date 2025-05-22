
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceTypeFieldProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceTypeField({ form }: ServiceTypeFieldProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("serviceType")}</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <SelectTrigger className="bg-black border-gray-700">
                <SelectValue>
                  {field.value === "http" && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>HTTP/S</span>
                    </div>
                  )}
                  {field.value !== "http" && "Select a service type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                <SelectItem value="http">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>HTTP/S</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("MonitorWebsitesAndRESTAPIsWithHTTPHTTPSProtocol")}
                    </p>
                  </div>
                </SelectItem>
                <SelectItem value="ping">PING</SelectItem>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="dns">DNS</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
