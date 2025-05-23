
import React from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from "../userForms";

interface UserRoleFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
}

const UserRoleField = ({ control, name, label, disabled = false }: UserRoleFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default UserRoleField;