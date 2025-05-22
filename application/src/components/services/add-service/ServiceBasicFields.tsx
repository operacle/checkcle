
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceBasicFieldsProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceBasicFields({ form }: ServiceBasicFieldsProps) {
  const { t } = useLanguage();
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("serviceName")}</FormLabel>
            <FormControl>
              <Input 
                placeholder="Service Name" 
                className="bg-black border-gray-700" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("serviceURL")}</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://example.com" 
                className="bg-black border-gray-700" 
                {...field}
                onChange={(e) => {
                  console.log("URL field changed:", e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
