
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MouseEvent } from "react";

interface ServiceFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

export function ServiceFormActions({ 
  isSubmitting, 
  onCancel,
  submitLabel = "Create Service"
}: ServiceFormActionsProps) {
  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isSubmitting) {
      onCancel();
    }
  };

  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button 
        type="button" 
        onClick={handleCancel}
        variant="outline"
        disabled={isSubmitting}
        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
