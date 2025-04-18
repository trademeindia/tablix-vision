
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
  const [isLoading, setIsLoading] = useState(initialLoading);
  const { tables, fetchTables, deleteTable, isLoading: dbLoading } = useQRListDatabase(restaurantId);
  const { deleteDialogOpen, tableToDelete, setDeleteDialogOpen, confirmDelete, clearTableToDelete } = useQRDeleteDialog();
  const { handleTest } = useQRTest();

  // Set loading state based on database loading
  useEffect(() => {
    setIsLoading(dbLoading || initialLoading);
  }, [dbLoading, initialLoading]);

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
      // The tables state will be automatically updated via the real-time subscription
    }
    
    clearTableToDelete();
  };

  return {
    tables,
    isLoading,
    deleteDialogOpen,
    tableToDelete,
    fetchTables,
    handleDownload,
    handleShare,
    handleTest,
    confirmDelete,
    handleDeleteTable,
    setDeleteDialogOpen
  };
}
