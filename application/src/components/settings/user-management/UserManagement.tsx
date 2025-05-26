
import React from "react";
import UserTable from "./UserTable";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { useUserManagement } from "./hooks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserCog, Loader2, AlertCircle, Info, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
const UserManagement = () => {
  const {
    users,
    loading,
    error,
    newUserForm,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isDialogOpen,
    setIsDialogOpen,
    isDeleting,
    setIsDeleting,
    isSubmitting,
    updateError,
    form,
    currentUser,
    userToDelete,
    handleEditUser,
    handleDeletePrompt,
    handleDeleteUser,
    onSubmit,
    onAddUser,
    fetchUsers
  } = useUserManagement();

  // Get the current logged in user to check their role
  const loggedInUser = authService.getCurrentUser();
  const isSuperAdmin = loggedInUser?.role === "superadmin";
  return <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full" defaultValue="user-management">
        <AccordionItem value="user-management">
          <AccordionTrigger className="py-4 px-5 bg-card hover:bg-card/90 hover:no-underline rounded-lg text-lg font-medium flex items-center w-full">
            <div className="flex items-center">
              <UserCog className="h-5 w-5 mr-2 text-green-500" />
              <span>User Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-6 bg-background rounded-b-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              {isSuperAdmin && <button onClick={() => setIsAddUserDialogOpen(true)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center">
                  <span className="mr-1">+</span> Add User
                </button>}
            </div>

            {!isSuperAdmin && <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Permission Notice:</span> As an admin user, you have access to view and modify existing user details. However, only Super Admins have permission to create new user accounts. Contact your Super Admin if you need to add a new user.
                </AlertDescription>
              </Alert>}

            {loading ? <div className="p-8 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                <p className="text-muted-foreground">Loading users...</p>
              </div> : error ? <div className="p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-destructive font-medium mb-2">Failed to load users</p>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchUsers} variant="outline">
                  Retry
                </Button>
              </div> : <UserTable users={users} onUserUpdate={handleEditUser} onUserDelete={handleDeletePrompt} />}

            <AddUserDialog isOpen={isAddUserDialogOpen && isSuperAdmin} setIsOpen={setIsAddUserDialogOpen} form={newUserForm} onSubmit={onAddUser} isSubmitting={isSubmitting} />

            <EditUserDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} form={form} user={currentUser} onSubmit={onSubmit} isSubmitting={isSubmitting} error={updateError} />

            <DeleteUserDialog isOpen={isDeleting} setIsOpen={setIsDeleting} user={userToDelete} onDelete={handleDeleteUser} isDeleting={isSubmitting} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
};
export default UserManagement;

