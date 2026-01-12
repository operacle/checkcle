import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRangeOption } from "../DateRangeFilter";
import { authService } from "@/services/authService";
import { ServiceDetailContent } from "../ServiceDetailContent";
import { ServiceDetailWrapper } from "./ServiceDetailWrapper";
import { useServiceData, useRealTimeUpdates } from "./hooks";

export const ServiceDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() - 24);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    return date;
  });
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('24h');
  
  const currentUser = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const {
    service,
    uptimeData,
    isLoading,
    handleStatusChange,
    fetchUptimeData,
    setService,
    setUptimeData,
    selectedRegionalAgent,
    handleRegionalAgentChange
  } = useServiceData(id, startDate, endDate);

  useRealTimeUpdates({
    serviceId: id,
    startDate,
    endDate,
    setService,
    setUptimeData
  });

  const handleDateRangeChange = useCallback((start: Date, end: Date, option: DateRangeOption) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedRange(option);
    
    if (id) {
      fetchUptimeData(id, start, end, option, selectedRegionalAgent);
    }
  }, [id, fetchUptimeData, selectedRegionalAgent]);

  return (
    <ServiceDetailWrapper
      isLoading={isLoading}
      service={service}
      currentUser={currentUser}
      handleLogout={handleLogout}
    >
      {service ? (
        <ServiceDetailContent 
          service={service}
          uptimeData={uptimeData}
          onDateRangeChange={handleDateRangeChange}
          onStatusChange={handleStatusChange}
          selectedDateOption={selectedRange}
          selectedRegionalAgent={selectedRegionalAgent}
          onRegionalAgentChange={handleRegionalAgentChange}
        />
      ) : null}
    </ServiceDetailWrapper>
  );
};