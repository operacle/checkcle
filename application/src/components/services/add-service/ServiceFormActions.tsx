
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
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
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