
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, subHours, subMonths, subWeeks, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateRangeOption = '60min' | '24h' | '7d' | '30d' | '1y' | 'custom';

interface DateRangeFilterProps {
  onRangeChange: (startDate: Date, endDate: Date, option: DateRangeOption) => void;
  selectedOption?: DateRangeOption;
}

// Define a proper type for the date range
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function DateRangeFilter({ onRangeChange, selectedOption = '24h' }: DateRangeFilterProps) {
  const [currentOption, setCurrentOption] = useState<DateRangeOption>(selectedOption);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOptionChange = (value: string) => {
    const option = value as DateRangeOption;
    setCurrentOption(option);
    
    const now = new Date();
    let startDate: Date;
    
    switch (option) {
      case '60min':
        // Ensure we're getting exactly 60 minutes ago
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        console.log(`60min option selected: ${startDate.toISOString()} to ${now.toISOString()}`);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      case 'custom':
        // Don't trigger onRangeChange for custom until both dates are selected
        setIsCalendarOpen(true);
        return;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    console.log(`DateRangeFilter: Option changed to ${option}, date range: ${startDate.toISOString()} to ${now.toISOString()}`);
    onRangeChange(startDate, now, option);
  };

  // Handle custom date range selection
  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      return;
    }
    
    setCustomDateRange(range);
    
    if (range.from && range.to) {
      // Ensure that we have both from and to dates before triggering the change
      const startOfDay = new Date(range.from);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(range.to);
      endOfDay.setHours(23, 59, 59, 999);
      
      console.log(`DateRangeFilter: Custom range selected: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
      onRangeChange(startOfDay, endOfDay, 'custom');
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={currentOption} onValueChange={handleOptionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="60min">Last 60 minutes</SelectItem>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="1y">Last year</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {currentOption === 'custom' && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !customDateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDateRange.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, "LLL dd, y")} -{" "}
                    {format(customDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(customDateRange.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              selected={customDateRange}
              onSelect={handleCustomRangeSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
