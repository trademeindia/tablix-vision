
import { useState } from 'react';

/**
 * Hook for managing QR code deletion dialog
 */
export function useQRDeleteDialog() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);

  /**
   * Opens the delete confirmation dialog
   * @param tableId The ID of the table to delete
   */
  const confirmDelete = (tableId: string) => {
    setTableToDelete(tableId);
    setDeleteDialogOpen(true);
  };

  /**
   * Clears the table to delete state
   */
  const clearTableToDelete = () => {
    setTableToDelete(null);
  };

  return {
    deleteDialogOpen,
    tableToDelete,
    setDeleteDialogOpen,
    confirmDelete,
    clearTableToDelete
  };
}
