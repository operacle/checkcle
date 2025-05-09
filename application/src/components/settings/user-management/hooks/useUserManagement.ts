
import { useUsersList } from "./useUsersList";
import { useUserForm } from "./useUserForm";
import { useUserDialogs } from "./useUserDialogs";
import { useUserOperations } from "./useUserOperations";
import { User } from "@/services/userService";
import { UserFormValues, NewUserFormValues } from "../userForms";

export const useUserManagement = () => {
  const { users, loading, error, fetchUsers } = useUsersList();
  const { form, newUserForm } = useUserForm();
  const {
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
    handleEditUser: baseHandleEditUser,
    handleDeletePrompt,
  } = useUserDialogs();

  const {
    handleDeleteUser: baseHandleDeleteUser,
    onSubmit: baseOnSubmit,
    onAddUser: baseOnAddUser,
  } = useUserOperations(
    fetchUsers,
    setIsDialogOpen,
    setIsAddUserDialogOpen,
    setIsSubmitting,
    setIsDeleting,
    setUpdateError,
    newUserForm.reset
  );

  // Wrapper functions to provide the needed arguments
  const handleEditUser = (user: User) => {
    baseHandleEditUser(user, form);
  };

  const handleDeleteUser = async () => {
    await baseHandleDeleteUser(userToDelete);
    setUserToDelete(null);
  };

  const onSubmit = (data: UserFormValues) => {
    baseOnSubmit(data, currentUser);
  };

  const onAddUser = (data: NewUserFormValues) => {
    baseOnAddUser(data);
  };

  return {
    users,
    loading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isDeleting,
    setIsDeleting,
    isSubmitting,
    updateError,
    form,
    newUserForm,
    currentUser,
    userToDelete,
    fetchUsers,
    handleEditUser,
    handleDeletePrompt,
    handleDeleteUser,
    onSubmit,
    onAddUser,
  };
};
