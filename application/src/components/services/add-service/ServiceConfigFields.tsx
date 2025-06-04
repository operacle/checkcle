
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";

interface ServiceConfigFieldsProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceConfigFields({ form }: ServiceConfigFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heartbeat Interval</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="60" 
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
            <FormLabel>Maximum Retries</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="3" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}