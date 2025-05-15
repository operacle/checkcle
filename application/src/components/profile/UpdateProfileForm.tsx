
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Profile update form schema
const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UpdateProfileFormProps {
  user: User;
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize the form with current user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    setUpdateError(null);
    setEmailChangeRequested(false);
    
    try {
      console.log("Submitting profile update with data:", data);
      
      // Detect if email is being changed
      const isEmailChanged = data.email !== user.email;
      
      // Create update payload with all fields
      const updateData = {
        full_name: data.full_name,
        username: data.username,
        email: isEmailChanged ? data.email : undefined,
        // Only set emailVisibility if email is being changed
        emailVisibility: isEmailChanged ? true : undefined
      };
      
      console.log("Sending update payload:", updateData);
      
      // Update user data using the userService
      await userService.updateUser(user.id, updateData);
      
      // Refresh user data in auth context
      await authService.refreshUserData();
      
      // If email was changed, show a specific message
      if (isEmailChanged) {
        setEmailChangeRequested(true);
        toast({
          title: "Email change requested",
          description: "A verification email has been sent to your new email address. Please check your inbox and follow the instructions to complete the change.",
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setUpdateError(errorMessage);
      
      toast({
        title: "Update failed",
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
        {updateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}
        
        {emailChangeRequested && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              A verification email has been sent to your new email address. 
              Please check your inbox and follow the instructions to complete the change.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
              {field.value !== user.email && (
                <p className="text-xs text-muted-foreground mt-1">
                  Changing your email requires verification. A verification email will be sent.
                </p>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}