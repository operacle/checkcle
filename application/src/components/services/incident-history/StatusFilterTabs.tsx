
import { Activity, AlertTriangle, CheckCircle, Pause, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusFilter } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

interface StatusFilterTabsProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

export function StatusFilterTabs({
  statusFilter,
  onStatusFilterChange
}: StatusFilterTabsProps) {
  // Get current theme to apply appropriate styling
  const { theme } = useTheme();
  
  return (
    <Tabs 
      value={statusFilter} 
      onValueChange={value => onStatusFilterChange(value as StatusFilter)} 
      className="w-full"
    >
      <TabsList className={`grid grid-cols-5 w-full max-w-md rounded-full ${
        theme === 'dark' ? 'bg-secondary' : 'bg-slate-100'
      }`}>
        <TabsTrigger 
          value="all" 
          className="rounded-full flex items-center gap-1 data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-[#D6BCFA] text-[#8E9196]"
        >
          <Activity className="h-4 w-4" />
          <span>All</span>
        </TabsTrigger>
        <TabsTrigger 
          value="up" 
          className="rounded-full flex items-center gap-1 data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-[#D6BCFA] text-[#8E9196]"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Up</span>
        </TabsTrigger>
        <TabsTrigger 
          value="down" 
          className="rounded-full flex items-center gap-1 data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-[#D6BCFA] text-[#8E9196]"
        >
          <X className="h-4 w-4" />
          <span>Down</span>
        </TabsTrigger>
        <TabsTrigger 
          value="warning" 
          className="rounded-full flex items-center gap-1 data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-[#D6BCFA] text-[#8E9196]"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Warning</span>
        </TabsTrigger>
        <TabsTrigger 
          value="paused" 
          className="rounded-full flex items-center gap-1 data-[state=active]:bg-[#1A1F2C] data-[state=active]:text-[#D6BCFA] text-[#8E9196]"
        >
          <Pause className="h-4 w-4" />
          <span>Paused</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
