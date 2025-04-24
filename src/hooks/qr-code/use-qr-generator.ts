
import { useState, useCallback } from 'react';
import { validateTableNumber, validateSeats, validateRestaurantId } from '@/utils/qr-validation';
import { downloadQRCode } from '@/utils/qr-download';
import { shareQRCode } from '@/utils/qr-share';
import { useQRDatabase } from './use-qr-database';
import { useQRTest } from './use-qr-test';

/**
 * Hook for QR code generation functionality
 * @param restaurantId The restaurant ID for which QR codes are being generated
 */
export function useQrGenerator(restaurantId: string) {
  const [tableNumber, setTableNumber] = useState('1');
  const [size, setSize] = useState('256');
  const [seats, setSeats] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const { isSaving, saveQRCodeToDatabase } = useQRDatabase(restaurantId);
  const { handleTest } = useQRTest();

  const handleGenerate = useCallback(async () => {
    // Validate inputs
    if (!validateTableNumber(tableNumber)) return;
    if (!validateSeats(seats)) return;
    if (!validateRestaurantId(restaurantId)) return;
    
    setIsGenerating(true);
    
    try {
      // Generate the QR code
      const baseUrl = window.location.origin;
      // Use the right path and query parameters for customer menu
      const value = `${baseUrl}/customer/menu?restaurant=${restaurantId}&table=${tableNumber}`;
      
      console.log("Generated QR code with URL:", value);
      
      setQrValue(value);
      
      // Save the QR code to the database
      await saveQRCodeToDatabase(tableNumber, value, seats);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [restaurantId, tableNumber, seats, saveQRCodeToDatabase]);

  const handleDownload = useCallback(() => {
    if (!qrValue) return;
    
    downloadQRCode(
      'qr-code-svg',
      parseInt(size),
      `qr-code-table-${tableNumber}.png`
    );
  }, [qrValue, size, tableNumber]);

  const handleShare = useCallback(() => {
    if (!qrValue) return;
    
    shareQRCode(
      qrValue,
      `Table ${tableNumber}`
    );
  }, [qrValue, tableNumber]);

  return {
    tableNumber,
    setTableNumber,
    size,
    setSize,
    seats,
    setSeats,
    isGenerating,
    qrValue,
    isSaving,
    handleGenerate,
    handleDownload,
    handleShare,
    handleTest: () => handleTest(qrValue)
  };
}
