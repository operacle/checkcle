
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Control } from "react-hook-form";

// Custom interface for local profile images
interface ProfileImage {
  url: string;
  label: string;
}

// Define local profile image paths - include all uploaded SVG images
const localProfileImages: ProfileImage[] = [
  { url: "/upload/profile/profile1.svg", label: "Profile 1" },
  { url: "/upload/profile/profile2.svg", label: "Profile 2" },
  { url: "/upload/profile/profile3.svg", label: "Profile 3" },
  { url: "/upload/profile/profile4.svg", label: "Profile 4" },
  { url: "/upload/profile/profile5.svg", label: "Profile 5" },
  { url: "/upload/profile/profile6.svg", label: "Profile 6" },
  { url: "/upload/profile/profile7.svg", label: "Profile 7" },
  { url: "/upload/profile/profile8.svg", label: "Profile 8" }
];

interface UserProfilePictureFieldProps {
  control: Control<any>;
}

const UserProfilePictureField = ({ control }: UserProfilePictureFieldProps) => {
  return (
    <FormField
      control={control}
      name="avatar"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="grid grid-cols-3 gap-4"
          >
            {localProfileImages.map((avatar) => (
              <FormItem key={avatar.url} className="flex flex-col items-center justify-center space-y-1">
                <FormControl>
                  <RadioGroupItem
                    value={avatar.url}
                    id={`new-${avatar.url}`}
                    className="sr-only"
                  />
                </FormControl>
                <label
                  htmlFor={`new-${avatar.url}`}
                  className={`cursor-pointer rounded-md p-1 ${
                    field.value === avatar.url
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar.url} alt={avatar.label} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </label>
                <div className="text-xs text-center">{avatar.label}</div>
              </FormItem>
            ))}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserProfilePictureField;
