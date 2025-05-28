import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

// Password change form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Function to determine which collection the user belongs to
  const getUserCollection = async (userId: string): Promise<string> => {
    try {
      // First try to find the user in the regular users collection
      await pb.collection('users').getOne(userId);
      return 'users';
    } catch (error) {
      try {
        // If not found, try the superadmin collection
        await pb.collection('_superusers').getOne(userId);
        return '_superusers';
      } catch (error) {
        throw new Error('User not found in any collection');
      }
    }
  };

  async function onSubmit(data: PasswordFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Starting password change for user:", userId);
      
      // Determine which collection the user belongs to
      const collection = await getUserCollection(userId);
      console.log("User found in collection:", collection);
      
      // PocketBase requires the old password along with the new one
      await pb.collection(collection).update(userId, {
        oldPassword: data.currentPassword,
        password: data.newPassword,
        passwordConfirm: data.confirmPassword,
      });

      // Refresh auth data to ensure token remains valid
      await authService.refreshUserData();
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully. You will be logged out in 3 seconds for security.",
      });
      
      // Reset the form
      form.reset();
      
      // Auto logout after successful password change
      setTimeout(() => {
        console.log("Auto logout after password change");
        authService.logout();
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      console.error("Password change error:", error);
      
      let errorMessage = "Failed to update password. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Failed to authenticate")) {
          errorMessage = "Current password is incorrect. Please try again.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "User account not found. Please contact your administrator.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Password change failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Your current password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showCurrentPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showNewPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </Form>
  );
}