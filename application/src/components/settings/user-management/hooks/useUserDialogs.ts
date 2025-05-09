
import { useState } from "react";
import { User } from "@/services/userService";

export const useUserDialogs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleEditUser = (user: User, form: any) => {
    setUpdateError(null);
    setCurrentUser(user);
    form.reset({
      full_name: user.full_name || "",
      email: user.email,
      username: user.username,
      isActive: user.isActive !== undefined ? user.isActive : true,
      role: user.role || "user",
      avatar: user.avatar || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (user: User) => {
    setUserToDelete(user);
    setIsDeleting(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isDeleting,
    setIsDeleting,
    isSubmitting,
    setIsSubmitting,
    updateError,
    setUpdateError,
    currentUser,
    setCurrentUser,
    userToDelete,
    setUserToDelete,
    handleEditUser,
    handleDeletePrompt,
  };
};
