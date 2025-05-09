
import { useState } from "react";

export function useDialogState() {
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
  };
  
  const handleDeleteDialogChange = (open: boolean, isDeleting: boolean = false) => {
    // Only allow closing if not currently deleting
    if (!isDeleting || !open) {
      setIsDeleteDialogOpen(open);
    }
  };

  return {
    isHistoryDialogOpen,
    isDeleteDialogOpen,
    isEditDialogOpen,
    setIsHistoryDialogOpen,
    setIsDeleteDialogOpen,
    setIsEditDialogOpen,
    handleEditDialogChange,
    handleDeleteDialogChange
  };
}
