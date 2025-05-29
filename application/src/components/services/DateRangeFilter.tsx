
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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateRangeOption = '24h' | '7d' | '30d' | '1y' | 'custom';

interface DateRangeFilterProps {
  onRangeChange: (startDate: Date, endDate: Date, option: DateRangeOption) => void;
  selectedOption?: DateRangeOption;
}

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
    let endDate: Date = new Date(now.getTime() + (5 * 60 * 1000)); // Add 5 minutes buffer to future
    
    switch (option) {
      case '24h':
        startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        break;
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '1y':
        startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
        break;
      case 'custom':
        setIsCalendarOpen(true);
        return;
      default:
        startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // Default to 24 hours
    }
    
    console.log(`DateRangeFilter: ${option} selected, range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    onRangeChange(startDate, endDate, option);
  };

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    if (!range || !range.from || !range.to) {
      return;
    }
    
    setCustomDateRange(range);
    
    const startOfDay = new Date(range.from);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(range.to);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log(`Custom range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
    onRangeChange(startOfDay, endOfDay, 'custom');
    setIsCalendarOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={currentOption} onValueChange={handleOptionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
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