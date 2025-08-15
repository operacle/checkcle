
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Service } from "@/services/serviceService";
import { StatusCards } from "./StatusCards";
import { ServiceFilters } from "./ServiceFilters";
import { ServicesTable } from "./ServicesTable";
import { AddServiceDialog } from "@/components/services/AddServiceDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardContentProps {
  services: Service[];
  isLoading: boolean;
  error: Error | null;
}

export const DashboardContent = ({ services, isLoading, error }: DashboardContentProps) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  // Filter services based on search term and type filter
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (service.url && service.url.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || service.type.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground">
        <p>Error loading service data.</p>
        <Button onClick={() => window.location.reload()}>{t('retry')}</Button>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-auto bg-background p-6 pb-0">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t('overview')}</h2>
          <Button 
            className="text-primary-foreground"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> {t('newService')}
          </Button>
        </div>
        
        <StatusCards services={services} />
        
        <ServiceFilters 
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          servicesCount={filteredServices.length}
        />
        
        <div className="flex-1 flex flex-col pb-6">
          <ServicesTable services={filteredServices} />
        </div>
      </div>

      <AddServiceDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </main>
  );
};
