
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Service</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new service to monitor.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 overflow-auto" style={{ height: "calc(80vh - 180px)" }}>
          <div className="pr-2">
            <ServiceForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}