import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRangeOption } from "../DateRangeFilter";
import { authService } from "@/services/authService";
import { ServiceDetailContent } from "../ServiceDetailContent";
import { ServiceDetailWrapper } from "./ServiceDetailWrapper";
import { useServiceData, useRealTimeUpdates } from "./hooks";
import { toast } from "@/components/ui/use-toast";

export const ServiceDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Set default to 24h
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() - 24); // Go back 24 hours
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5); // Add 5 minutes buffer to future
    return date;
  });
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('24h');
  
  // State for sidebar collapse functionality (shared with Dashboard)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check if there's a saved preference in localStorage
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : window.innerWidth < 768;
  });
  
  // Toggle sidebar and save preference
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  }, []);
  
  // Get current user for header
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    // Verify user is authenticated
    if (!authService.isAuthenticated()) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to view service details",
      });
      navigate("/login");
    }
    
    // Auto-collapse sidebar on small screens
    const handleResize = () => {
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(true));
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, sidebarCollapsed]);
  
  // Handler for logout (same as Dashboard)
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Use our custom hooks
  const {
    service,
    uptimeData,
    isLoading,
    handleStatusChange,
    fetchUptimeData,
    setService,
    setUptimeData
  } = useServiceData(id, startDate, endDate);

  // Set up real-time updates
  useRealTimeUpdates({
    serviceId: id,
    startDate,
    endDate,
    setService,
    setUptimeData
  });

  // Handle date range filter changes
  const handleDateRangeChange = useCallback((start: Date, end: Date, option: DateRangeOption) => {
    console.log(`ServiceDetailContainer: Date range changed: ${start.toISOString()} to ${end.toISOString()}, option: ${option}`);
    
    // Update state which will trigger the useEffect in useServiceData
    setStartDate(start);
    setEndDate(end);
    setSelectedRange(option);
    
    // Also explicitly fetch data with the new range to ensure immediate update
    if (id) {
      console.log(`ServiceDetailContainer: Explicitly fetching data for service ${id} with new range`);
      fetchUptimeData(id, start, end, option);
    }
  }, [id, fetchUptimeData]);

  return (
    <ServiceDetailWrapper
      isLoading={isLoading}
      service={service}
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      currentUser={currentUser}
      handleLogout={handleLogout}
    >
      {service && (
        <ServiceDetailContent 
          service={service}
          uptimeData={uptimeData}
          onDateRangeChange={handleDateRangeChange}
          onStatusChange={handleStatusChange}
          selectedDateOption={selectedRange}
        />
      )}
    </ServiceDetailWrapper>
  );
};