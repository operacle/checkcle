
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { Badge } from '@/components/ui/badge';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AssignedUsersField = () => {
  const { t } = useLanguage();
  const form = useFormContext();

  // Ensure assigned_users is initialized as an array
  useEffect(() => {
    const currentValue = form.getValues('assigned_users');
    console.log("Initial assigned_users value:", currentValue);
    
    // Initialize as empty array if no value or invalid value
    if (!currentValue || !Array.isArray(currentValue)) {
      console.log("Initializing assigned_users as empty array");
      form.setValue('assigned_users', [], { shouldValidate: false, shouldDirty: true });
    }
  }, [form]);

  console.log("Current form values:", form.getValues());
  console.log("Current assigned_users:", form.getValues('assigned_users'));

  // Fetch users for the assignment dropdown
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const usersList = await userService.getUsers();
        console.log("Fetched users for assignment:", usersList);
        return Array.isArray(usersList) ? usersList : [];
      } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
      }
    },
    staleTime: 300000 // Cache for 5 minutes to reduce API calls
  });

  // Get the currently selected assigned users from the form
  const selectedUserIds = Array.isArray(form.watch('assigned_users')) 
    ? form.watch('assigned_users') 
    : [];
  
  console.log("Selected user IDs:", selectedUserIds);

  // Function to add a user
  const addUser = (userId: string) => {
    const currentValues = Array.isArray(form.getValues('assigned_users')) 
      ? [...form.getValues('assigned_users')] 
      : [];
      
    if (!currentValues.includes(userId)) {
      console.log("Adding user:", userId);
      form.setValue('assigned_users', [...currentValues, userId], { shouldValidate: true, shouldDirty: true });
    }
  };

  // Function to remove a user
  const removeUser = (userId: string) => {
    const currentValues = Array.isArray(form.getValues('assigned_users')) 
      ? [...form.getValues('assigned_users')] 
      : [];
      
    console.log("Removing user:", userId);
    form.setValue(
      'assigned_users', 
      currentValues.filter(id => id !== userId), 
      { shouldValidate: true, shouldDirty: true }
    );
  };

  // Get selected users data
  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
  console.log("Matched selected users:", selectedUsers);
  
  // Function to get user initials from name
  const getUserInitials = (user: any): string => {
    if (user.full_name) {
      const nameParts = user.full_name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.full_name.substring(0, 2).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };
  
  return (
    <FormField
      control={form.control}
      name="assigned_users"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {t('assignedPersonnel')}
          </FormLabel>
          <div className="space-y-3">
            <Select onValueChange={addUser}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectAssignedUsers')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <div className="py-2 px-2 text-sm">{t('loading')}</div>
                ) : users.length === 0 ? (
                  <div className="py-2 px-2 text-sm">{t('noUsersFound')}</div>
                ) : (
                  users.map((user) => (
                    <SelectItem 
                      key={user.id} 
                      value={user.id}
                      disabled={selectedUserIds.includes(user.id)}
                    >
                      {user.full_name || user.username}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {selectedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2 border p-2 rounded-md bg-muted/50">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={user.avatar} alt={user.full_name || user.username} />
                      <AvatarFallback className="text-[10px]">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.full_name || user.username}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:opacity-70"
                      onClick={() => removeUser(user.id)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('remove')}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic p-2">
                {t('noAssignedUsers')}
              </div>
            )}
          </div>

          <FormDescription>
            {t('assignedPersonnelDescription')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
