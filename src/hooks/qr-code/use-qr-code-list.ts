
import { useState, useEffect } from 'react';
import { useQRListDatabase, TableWithQR } from './use-qr-list-database';
import { useQRDeleteDialog } from './use-qr-delete-dialog';
import { downloadQRCodeFromList } from '@/utils/qr-list-download';
import { shareQRCode } from '@/utils/qr-share';
import { useQRTest } from './use-qr-test';

/**
 * Integrated hook for QR code list functionality
 * @param restaurantId The restaurant ID for which QR codes are being managed
 * @param initialLoading Initial loading state
 */
export function useQRCodeList(restaurantId: string, initialLoading: boolean) {
  const [tables, setTables] = useState<TableWithQR[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const { fetchTables, deleteTable } = useQRListDatabase(restaurantId);
  const { deleteDialogOpen, tableToDelete, setDeleteDialogOpen, confirmDelete, clearTableToDelete } = useQRDeleteDialog();
  const { handleTest } = useQRTest();

  // Fetch tables when component mounts or restaurantId changes
  useEffect(() => {
    if (restaurantId !== '00000000-0000-0000-0000-000000000000') {
      loadTables();
    }
  }, [restaurantId]);

  /**
   * Loads table data from the database
   */
  const loadTables = async () => {
    setIsLoading(true);
    try {
      const tablesData = await fetchTables();
      setTables(tablesData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the download of a QR code
   * @param qrValue The QR code value
   * @param tableNumber The table number
   */
  const handleDownload = (qrValue: string, tableNumber: number) => {
    downloadQRCodeFromList(tableNumber);
  };

  /**
   * Handles sharing a QR code
   * @param qrValue The QR code value
   * @param tableNumber The table number
   */
  const handleShare = (qrValue: string, tableNumber: number) => {
    shareQRCode(qrValue, `Table ${tableNumber}`);
  };

  /**
   * Handles the delete action for a table
   */
  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    
    const success = await deleteTable(tableToDelete);
    
    if (success) {
      // Update the state to remove the deleted table
      setTables(tables.filter(table => table.id !== tableToDelete));
    }
    
    clearTableToDelete();
  };

  return {
    tables,
    isLoading,
    deleteDialogOpen,
    tableToDelete,
    fetchTables: loadTables,
    handleDownload,
    handleShare,
    handleTest,
    confirmDelete,
    handleDeleteTable,
    setDeleteDialogOpen
  };
}
