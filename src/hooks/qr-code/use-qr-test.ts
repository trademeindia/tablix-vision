
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for QR code testing functionality
 */
export function useQRTest() {
  /**
   * Opens the QR code URL in a new tab for testing
   * @param qrValue The URL encoded in the QR code
   */
  const handleTest = useCallback((qrValue: string) => {
    if (!qrValue) return;
    
    window.open(qrValue, '_blank');
    
    toast({
      title: "Testing QR Code",
      description: "Opening QR code URL in a new tab for testing.",
    });
  }, []);

  return {
    handleTest
  };
}
