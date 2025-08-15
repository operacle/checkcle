
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const handleSuccess = async () => {
    // Immediately invalidate and refetch services data
    await queryClient.invalidateQueries({ queryKey: ["services"] });
    await queryClient.refetchQueries({ queryKey: ["services"] });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("createNewService")}</DialogTitle>
          <DialogDescription>
            {t("createNewServiceDesc")}
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