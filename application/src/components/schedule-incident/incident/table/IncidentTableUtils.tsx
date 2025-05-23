
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService, User } from '@/services/userService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get user initials
export const getUserInitials = (user: User): string => {
  if (user.full_name) {
    const nameParts = user.full_name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.full_name.substring(0, 2).toUpperCase();
  }
  return user.username.substring(0, 2).toUpperCase();
};

interface AssignedUserCellProps {
  userId?: string;
}

export const AssignedUserCell: React.FC<AssignedUserCellProps> = ({ userId }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        return await userService.getUser(userId);
      } catch (error) {
        console.error("Failed to fetch assigned user:", error);
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 300000 // Cache for 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }

  if (!user || !userId) {
    return <span>-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar} alt={user.full_name || user.username} />
        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
      </Avatar>
      <span className="truncate max-w-[100px]">{user.full_name || user.username}</span>
    </div>
  );
};
