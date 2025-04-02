
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export function useQRDataParser() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const parseQRData = useCallback((data: string) => {
    try {
      console.log('Parsing QR data:', data);
      setError(null);
      
      // Handle both URL and URL string formats
      let url: URL;
      
      try {
        // Try to parse as complete URL
        url = new URL(data);
      } catch (e) {
        // If that fails, try to parse as a relative path with search params
        try {
          url = new URL(data, window.location.origin);
        } catch (err) {
          throw new Error('Invalid QR code format');
        }
      }
      
      // Extract parameters from URL search params
      const params = url.searchParams;
      const tableParam = params.get('table');
      const restaurantParam = params.get('restaurant');
      
      if (!tableParam || !restaurantParam) {
        throw new Error('Missing required parameters in QR code');
      }
      
      console.log('Extracted params:', { table: tableParam, restaurant: restaurantParam });
      
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
      
      return { tableId: tableParam, restaurantId: restaurantParam };
    } catch (err) {
      console.error('Error parsing QR code data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      toast({
        title: 'Invalid QR Code',
        description: 'Could not parse the QR code data. Please try again.',
        variant: 'destructive',
      });
      
      return { tableId: null, restaurantId: null };
    }
  }, []);

  const resetQRData = useCallback(() => {
    setTableId(null);
    setRestaurantId(null);
    setError(null);
  }, []);

  return {
    tableId,
    restaurantId,
    error,
    parseQRData,
    resetQRData
  };
}
