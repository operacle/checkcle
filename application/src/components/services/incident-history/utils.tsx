
import { CheckCircle, AlertTriangle, X, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UptimeData } from "@/types/service.types";
import { format } from "date-fns";
import { StatusInfo } from "./types";

// Get appropriate icon and style for each status
export const getStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case "up":
      return { 
        icon: <CheckCircle className="h-4 w-4 text-green-500 mr-2" />, 
        text: "Up", 
        textColor: "text-green-500",
        badge: <Badge variant="default" className="bg-emerald-800 text-white hover:bg-emerald-700">Up</Badge>
      };
    case "warning":
      return { 
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />, 
        text: "Warning", 
        textColor: "text-yellow-500",
        badge: <Badge variant="outline" className="bg-yellow-800/80 text-yellow-300 border-yellow-700 hover:bg-yellow-800">Warning</Badge>
      };
    case "paused":
      return { 
        icon: <Pause className="h-4 w-4 text-gray-500 mr-2" />, 
        text: "Paused", 
        textColor: "text-gray-500",
        badge: <Badge variant="outline" className="bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800">Paused</Badge>
      };
    default: // down
      return { 
        icon: <X className="h-4 w-4 text-red-500 mr-2" />, 
        text: "Down", 
        textColor: "text-red-500",
        badge: <Badge variant="destructive">Down</Badge>
      };
  }
};

// Filter the uptimeData to only include status changes (incidents)
export const getStatusChangeEvents = (uptimeData: UptimeData[]): UptimeData[] => {
  if (!uptimeData.length) return [];

  // First sort the data by timestamp (newest first for display)
  const sortedData = [...uptimeData].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // We need to find all status changes, including to/from paused
  const statusChanges: UptimeData[] = [];
  
  // Always include the most recent check as a baseline
  if (sortedData.length > 0) {
    statusChanges.push(sortedData[0]);
  }
  
  // Compare each check with the previous one to detect status changes
  for (let i = 0; i < sortedData.length - 1; i++) {
    const currentCheck = sortedData[i];
    const nextCheck = sortedData[i + 1]; // This is actually the "older" check
    
    // If the status changed, add the "older" check to our incidents list
    // This shows what the status changed TO
    if (currentCheck.status !== nextCheck.status) {
      statusChanges.push(nextCheck);
    }
  }

  console.log(`Found ${statusChanges.length} status changes, including paused status changes: ${statusChanges.some(i => i.status === 'paused')}`);
  
  return statusChanges;
};

// Get date range for display
export const getDateRangeDisplay = (incidents: UptimeData[]): string => {
  if (!incidents.length) return "";
  
  const sortedData = [...incidents].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const start = format(new Date(sortedData[0].timestamp), 'MMM dd, yyyy');
  const end = format(new Date(sortedData[sortedData.length - 1].timestamp), 'MMM dd, yyyy');
  
  // Display date range if different dates
  return start === end ? start : `${start} - ${end}`;
};
