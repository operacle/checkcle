
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Service } from "@/types/service.types";
import { ServiceUptimeHistory } from "@/components/services/ServiceUptimeHistory";
import { useTheme } from "@/contexts/ThemeContext";
import { DateRangeFilter, DateRangeOption } from "@/components/services/DateRangeFilter";

interface ServiceHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
}

export const ServiceHistoryDialog = ({
  isOpen,
  onOpenChange,
  selectedService,
}: ServiceHistoryDialogProps) => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 24 * 60 * 60 * 1000)); // Default to 24h ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  // Reset date range when dialog opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      setStartDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
      setEndDate(new Date());
    }
  }, [isOpen]);
  
  // Handle date range filter changes
  const handleDateRangeChange = (start: Date, end: Date, option: DateRangeOption) => {
    console.log(`ServiceHistoryDialog: Date range changed to ${start.toISOString()} - ${end.toISOString()}`);
    setStartDate(start);
    setEndDate(end);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme === 'dark' ? 'bg-black text-white border-gray-800' : 'bg-background text-foreground border-border'} sm:max-w-[800px]`}>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedService?.name} - Uptime History
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
            Showing the most recent uptime checks for this service.
            {selectedService?.interval && (
              <span> Checked every {selectedService.interval} seconds.</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <DateRangeFilter onRangeChange={handleDateRangeChange} />
        </div>
        
        {selectedService && (
          <ServiceUptimeHistory 
            serviceId={selectedService.id} 
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
