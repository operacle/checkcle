
import { useEffect } from "react";
import { Service } from "@/types/service.types";
import { ServicesTableView } from "./ServicesTableView";
import { ServiceDeleteDialog } from "./ServiceDeleteDialog";
import { ServiceHistoryDialog } from "./ServiceHistoryDialog";
import { ServiceEditDialog } from "./ServiceEditDialog";
import { useServiceActions, useDialogState } from "./hooks";

interface ServicesTableContainerProps {
  services: Service[];
}

export const ServicesTableContainer = ({ services }: ServicesTableContainerProps) => {
  const {
    services: localServices,
    selectedService,
    isDeleting,
    setSelectedService,
    updateServices,
    handleViewDetail,
    handlePauseResume,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleMuteAlerts
  } = useServiceActions(services);

  const {
    isHistoryDialogOpen,
    isDeleteDialogOpen,
    isEditDialogOpen,
    setIsHistoryDialogOpen,
    setIsDeleteDialogOpen,
    handleEditDialogChange,
    handleDeleteDialogChange
  } = useDialogState();

  // Update local services state when props change
  useEffect(() => {
    updateServices(services);
  }, [services]);

  // Handler functions that combine local state management
  const onEdit = (service: Service) => {
    const selectedService = handleEdit(service);
    setTimeout(() => {
      handleEditDialogChange(true);
    }, 0);
  };
  
  const onDelete = (service: Service) => {
    handleDelete(service);
    setIsDeleteDialogOpen(true);
  };
  
  const openHistoryDialog = (service: Service) => {
    setSelectedService(service);
    setIsHistoryDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ServicesTableView 
        services={localServices}
        onViewDetail={handleViewDetail}
        onPauseResume={handlePauseResume}
        onEdit={onEdit}
        onDelete={onDelete}
        onMuteAlerts={handleMuteAlerts}
      />

      <ServiceHistoryDialog 
        isOpen={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        selectedService={selectedService}
      />

      <ServiceDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={(open) => handleDeleteDialogChange(open, isDeleting)}
        selectedService={selectedService}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />

      <ServiceEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogChange}
        service={selectedService}
      />
    </div>
  );
}
