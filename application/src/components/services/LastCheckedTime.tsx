
import React from "react";
import { Clock, TimerOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LastCheckedTimeProps {
  lastCheckedTime: string;
  status?: string;
  interval?: number;
}

export const LastCheckedTime = ({ lastCheckedTime, status, interval }: LastCheckedTimeProps) => {
  // Format the time without seconds to display a static time
  const formatTimeWithoutSeconds = (timeString: string) => {
    try {
      const date = new Date(timeString);
      
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        // If it's already in HH:MM format, just return it
        if (timeString.includes(':') && !timeString.includes(':00:')) {
          return timeString;
        }
        return timeString;
      }
      
      // Format to only show hours and minutes (HH:MM)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  // Get the formatted time without creating a new Date for paused services
  const formattedTime = formatTimeWithoutSeconds(lastCheckedTime);

  // Explicitly prevent real-time updates for paused services
  const isPaused = status === "paused";

  // Format the interval for display
  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    return `${minutes}min`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 text-sm text-gray-400 cursor-help">
            {isPaused ? (
              <TimerOff className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            <span>
              {isPaused ? "Paused at " : ""}
              {formattedTime}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top"
          className="bg-gray-900 text-white border-gray-800 px-3 py-2"
        >
          <div className="flex flex-col gap-1 text-xs">
            <div className="font-medium">
              {isPaused ? "Monitoring Paused" : "Last Check Details"}
            </div>
            <div>
              {isPaused ? "No automatic checks" : `Checked at ${formattedTime}`}
            </div>
            {interval && !isPaused && (
              <div>
                Check interval: {formatInterval(interval)}
              </div>
            )}
            <div className="text-gray-400 text-[10px]">
              {new Date(lastCheckedTime).toLocaleString()}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
