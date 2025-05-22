
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-gray-800 sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("createNewService")}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t("fillInTheDetailsToCreateANewServiceToMonitor")}
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
