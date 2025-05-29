
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService, User, UpdateUserData, CreateUserData } from "@/services/userService";
import { UserFormValues, NewUserFormValues } from "../userForms";
import { avatarOptions } from "../avatarOptions";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export const useUserOperations = (
  fetchUsers: () => Promise<void>,
  setIsDialogOpen: (isOpen: boolean) => void,
  setIsAddUserDialogOpen: (isOpen: boolean) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setIsDeleting: (isDeleting: boolean) => void,
  setUpdateError: (error: string | null) => void,
  newUserFormReset: (values: any) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteUser = async (userToDelete: User | null) => {
    if (!userToDelete) return;

    try {
      const success = await userService.deleteUser(userToDelete.id);
      if (success) {
        toast({
          title: "User deleted",
          description: `${userToDelete.full_name || userToDelete.username} has been deleted.`,
        });
        fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete user. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: UserFormValues, currentUser: User | null) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    setUpdateError(null);

    try {
      // Get current logged-in user to check if we're editing ourselves
      const loggedInUser = authService.getCurrentUser();
      const isEditingSelf = loggedInUser?.id === currentUser.id;
      const isEmailChanged = data.email !== currentUser.email;
      
      // Create update object with only the fields we want to update
      const updateData: UpdateUserData = {
        full_name: data.full_name,
        email: data.email,
        username: data.username,
        role: data.role,
        isActive: data.isActive,
      };
      
      // For avatar, only include if it's different from current one
      if (data.avatar && data.avatar !== currentUser.avatar) {
        updateData.avatar = data.avatar;
      }

      console.log("Submitting user update with data:", updateData);
      
      await userService.updateUser(currentUser.id, updateData);
      
      // Handle email change for current user
      if (isEditingSelf && isEmailChanged) {
        toast({
          title: "Email changed successfully",
          description: "You will be logged out for security reasons. Please log in again with your new email.",
          variant: "default",
        });
        
        setIsDialogOpen(false);
        
        // Auto-logout after 2 seconds if editing own email
        setTimeout(() => {
          authService.logout();
          navigate("/login");
        }, 2000);
        
        return; // Don't continue with normal flow
      }
      
      // Normal success flow for other users or non-email changes
      toast({
        title: "User updated",
        description: `${data.full_name || data.username}'s profile has been updated.`,
      });
      
      setIsDialogOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      let errorMessage = "Failed to update user. Please check your inputs and try again.";
      
      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUpdateError(errorMessage);
      toast({
        title: "Error updating user",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAddUser = async (data: NewUserFormValues) => {
    setIsSubmitting(true);
    try {
      const newUserData: CreateUserData = {
        username: data.username,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        full_name: data.full_name,
        role: data.role,
        isActive: data.isActive,
        avatar: data.avatar,
        emailVisibility: true,
      };

      await userService.createUser(newUserData);
      
      toast({
        title: "User created",
        description: `${data.full_name || data.username} has been added successfully.`,
      });
      
      setIsAddUserDialogOpen(false);
      newUserFormReset({
        full_name: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        isActive: true,
        role: "user",
        avatar: avatarOptions[0].url,
      });
      await fetchUsers();
    } catch (error: any) {
      let errorMessage = "Could not create user. Please try again later.";
      
      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error creating user",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleDeleteUser,
    onSubmit,
    onAddUser,
  };
};