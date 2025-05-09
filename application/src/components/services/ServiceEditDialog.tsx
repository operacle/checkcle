
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { Service } from "@/types/service.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function ServiceEditDialog({ open, onOpenChange, service }: ServiceEditDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset submission state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);
  
  const handleSuccess = () => {
    // Invalidate the services query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ["services"] });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Only render the form if dialog is open and service data exists
  // This prevents form validation errors when dialog is closed
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if not currently submitting
      if (!isSubmitting || !newOpen) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="bg-black text-white border-gray-800 sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Service</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the details of your monitored service.
          </DialogDescription>
        </DialogHeader>
        {open && service && (
          <ScrollArea className="flex-1 pr-4 overflow-auto" style={{ height: "calc(80vh - 180px)" }}>
            <div className="pr-2">
              <ServiceForm 
                onSuccess={handleSuccess} 
                onCancel={handleCancel}
                initialData={service}
                isEdit={true}
                onSubmitStart={() => setIsSubmitting(true)}
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
