
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Service } from "@/types/service.types";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

interface ServiceDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting?: boolean;
}

export const ServiceDeleteDialog = ({
  isOpen,
  onOpenChange,
  selectedService,
  onConfirmDelete,
  isDeleting = false,
}: ServiceDeleteDialogProps) => {
  const { theme } = useTheme();
  
  const handleConfirm = async () => {
    if (!isDeleting) {
      await onConfirmDelete();
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`${theme === 'dark' ? 'bg-gray-900 text-white border-gray-800' : 'bg-background text-foreground border-border'}`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
          <AlertDialogDescription className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
            This action cannot be undone. This will permanently delete{' '}
            <span className={theme === 'dark' ? 'font-semibold text-white' : 'font-semibold text-foreground'}>
              {selectedService?.name}
            </span>{' '}
            and all of its uptime records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-secondary'}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className={theme === 'dark' ? 'bg-red-900 text-white hover:bg-red-800' : 'bg-red-600 text-white hover:bg-red-700'}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
