
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface ServiceFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  servicesCount: number;
}

export const ServiceFilters = ({ 
  filter, 
  setFilter, 
  searchTerm, 
  setSearchTerm,
  servicesCount 
}: ServiceFiltersProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center">
        <h3 className="text-xl font-semibold mr-2 text-foreground">Currently Monitoring</h3>
        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-sm">
          {servicesCount}
        </span>
      </div>
      <div className="flex space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="HTTP">HTTP</SelectItem>
            <SelectItem value="PING">PING</SelectItem>
            <SelectItem value="TCP">TCP</SelectItem>
            <SelectItem value="DNS">DNS</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Input 
            className="w-72 bg-card border-border" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
