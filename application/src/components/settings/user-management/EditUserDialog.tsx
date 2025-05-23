
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
import UserRoleField from "./form-fields/UserRoleField";

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
      <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-1">
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
                  
                  <UserRoleField
                    control={form.control}
                    name="role"
                    label="Role"
                  />
                </div>
                
                <UserToggleField
                  control={form.control}
                  name="isActive"
                  label="Active Status"
                  description="User will be able to access the system"
                />
              </form>
            </Form>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
          >
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
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;