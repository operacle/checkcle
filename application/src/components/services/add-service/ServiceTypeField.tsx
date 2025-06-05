
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "./types";

interface ServiceTypeFieldProps {
  form: UseFormReturn<ServiceFormData>;
}

export function ServiceTypeField({ form }: ServiceTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Type</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <SelectTrigger>
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
              <SelectContent>
                <SelectItem value="http">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>HTTP/S</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monitor websites and REST APIs with HTTP/HTTPS protocol
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