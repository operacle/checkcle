
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService, User } from "@/services/userService";

export const useUsersList = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching users list");
      const data = await userService.getUsers();
      console.log("Received users data:", data);
      
      if (Array.isArray(data) && data.length >= 0) {
        setUsers(data);
        // Clear any previous errors
        setError(null);
      } else {
        console.error("Invalid users data format:", data);
        setUsers([]);
        setError("Invalid data format received from server");
        toast({
          title: "Warning",
          description: "No users found or could not load users.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Error fetching users",
        description: "Could not load users. Please try again later.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers };
};
