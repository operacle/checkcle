
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceConfigFieldsProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceConfigFields({ form }: ServiceConfigFieldsProps) {
  const { t } = useLanguage();
  return (
    <>
      <FormField
        control={form.control}
        name="interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("heartbeatInterval")}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="60" 
                className="bg-black border-gray-700" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
            
      <FormField
        control={form.control}
        name="retries"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("maximumRetries")}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="3" 
                className="bg-black border-gray-700" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
