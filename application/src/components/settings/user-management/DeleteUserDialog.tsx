
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/services/userService";
import { Loader2 } from "lucide-react";

interface DeleteUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User | null;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DeleteUserDialog = ({
  isOpen,
  setIsOpen,
  user,
  onDelete,
  isDeleting = false,
}: DeleteUserDialogProps) => {
  if (!user) return null;

  const handleCancel = () => {
    if (!isDeleting) {
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (!isDeleting) {
      onDelete();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(newOpen) => {
      // Only allow closing if not currently deleting
      if (!isDeleting || !newOpen) {
        setIsOpen(newOpen);
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {user.full_name || user.username}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
