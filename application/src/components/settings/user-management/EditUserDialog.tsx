
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseFormReturn } from "react-hook-form";
import { User } from "@/services/userService";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserTextField from "./form-fields/UserTextField";
import UserToggleField from "./form-fields/UserToggleField";
import UserProfilePictureField from "./form-fields/UserProfilePictureField";

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: UseFormReturn<any>;
  user: User | null;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

const EditUserDialog = ({ 
  isOpen, 
  setIsOpen, 
  form, 
  user, 
  onSubmit,
  isSubmitting = false,
  error = null
}: EditUserDialogProps) => {
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <UserProfilePictureField control={form.control} />
                
                <div className="grid grid-cols-2 gap-4">
                  <UserTextField
                    control={form.control}
                    name="full_name"
                    label="Full Name"
                    placeholder="Enter full name"
                  />
                  
                  <UserTextField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    type="email"
                  />
                  
                  <UserTextField
                    control={form.control}
                    name="username"
                    label="Username"
                    placeholder="Enter username"
                  />
                  
                  <UserTextField
                    control={form.control}
                    name="role"
                    label="Role"
                    placeholder="Enter role (e.g. admin, user)"
                  />
                </div>
                
                <UserToggleField
                  control={form.control}
                  name="isActive"
                  label="Active Status"
                  description="User will be able to access the system"
                />

                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
