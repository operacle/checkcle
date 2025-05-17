
import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { User } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  // State for sidebar collapse functionality
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  // Get current user
  const currentUser = authService.getCurrentUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch complete user data
  const fetchUserData = useCallback(async () => {
    if (!currentUser?.id) {
      console.error("No current user ID found");
      setLoading(false);
      setError("No user found. Please login again.");
      return;
    }
    
    try {
      console.log("Fetching user data for ID:", currentUser.id);
      const data = await userService.getUser(currentUser.id);
      console.log("Received user data:", data);
      
      if (data) {
        setUserData(data);
        setError(null);
      } else {
        console.error("No user data returned");
        setError("Could not load user data");
        toast({
          title: "Error",
          description: "Could not load user data. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to load user data:", error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, toast]);
  
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Please login to view your profile</p>
          <button 
            onClick={() => navigate("/login")} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-2">Loading user data...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                <p>{error}</p>
              </div>
              <button 
                onClick={() => fetchUserData()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProfileContent 
              currentUser={userData} 
              onUserUpdated={fetchUserData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;