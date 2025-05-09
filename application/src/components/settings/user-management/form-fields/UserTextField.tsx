
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface UserTextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const UserTextField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false
}: UserTextFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value || ''}
              onChange={e => {
                // Handle the value change properly
                const value = e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserTextField;
