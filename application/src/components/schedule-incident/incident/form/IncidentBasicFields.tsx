
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentFormValues } from '../hooks/useIncidentForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { Badge } from '@/components/ui/badge';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const IncidentBasicFields: React.FC = () => {
  const { t } = useLanguage();
  const form = useFormContext<IncidentFormValues>();
  const currentAssignedUserId = form.watch('assigned_to');

  // For assigned users functionality
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  // Update selectedUserIds when form value changes (for edit mode)
  useEffect(() => {
    if (currentAssignedUserId) {
      setSelectedUserIds([currentAssignedUserId]);
    }
  }, [currentAssignedUserId]);

  // Fetch users for assignment
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const usersList = await userService.getUsers();
        console.log("Fetched users for incident assignment:", usersList);
        return Array.isArray(usersList) ? usersList : [];
      } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
      }
    },
    staleTime: 300000 // Cache for 5 minutes
  });

  // Add user to assigned_to
  const addUser = (userId: string) => {
    // For now, we're using a single user assignment
    console.log("Setting user ID in form:", userId);
    form.setValue('assigned_to', userId, { shouldValidate: true, shouldDirty: true });
    setSelectedUserIds([userId]);
  };

  // Remove assigned user
  const removeUser = () => {
    form.setValue('assigned_to', '', { shouldValidate: true, shouldDirty: true });
    setSelectedUserIds([]);
  };

  // Get selected user data
  const selectedUser = users.find(user => user.id === form.getValues('assigned_to'));

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
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('title')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterIncidentTitle')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterIncidentDescription')}
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="service_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('serviceId')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterServiceId')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="assigned_to"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {t('assignedTo')}
            </FormLabel>
            <div className="space-y-3">
              <FormControl>
                <select
                  id="assigned-user-select"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.value || ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected user ID:", selectedValue);
                    if (selectedValue) {
                      addUser(selectedValue);
                    }
                  }}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  name={field.name}
                >
                  <option value="">{t('selectAssignedUser')}</option>
                  {users.map(user => (
                    <option 
                      key={user.id} 
                      value={user.id}
                    >
                      {user.full_name || user.username}
                    </option>
                  ))}
                </select>
              </FormControl>

              {selectedUser ? (
                <div className="flex flex-wrap gap-2 mt-2 border p-2 rounded-md bg-muted/50">
                  <Badge key={selectedUser.id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.full_name || selectedUser.username} />
                      <AvatarFallback className="text-[10px]">
                        {getUserInitials(selectedUser)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedUser.full_name || selectedUser.username}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:opacity-70"
                      onClick={removeUser}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('remove')}</span>
                    </Button>
                  </Badge>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic p-2">
                  {t('noAssignedUser')}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
