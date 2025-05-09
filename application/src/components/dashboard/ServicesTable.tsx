
import { Service } from "@/types/service.types";
import { ServicesTableContainer } from "@/components/services/ServicesTableContainer";

interface ServicesTableProps {
  services: Service[];
}

export const ServicesTable = ({ services }: ServicesTableProps) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ServicesTableContainer services={services} />
    </div>
  );
};
