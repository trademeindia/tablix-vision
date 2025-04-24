
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useMenuQRScanner(parseQRData: (data: string) => void, handleScan: (data: string) => void) {
  const queryClient = useQueryClient();
  
  const handleQRScan = useCallback((data: string) => {
    parseQRData(data);
    handleScan(data);
    
    try {
      const url = new URL(data);
      const params = new URLSearchParams(url.search);
      const resId = params.get('restaurant');
      
      if (resId) {
        console.log("Prefetching menu data for restaurant:", resId);
        queryClient.prefetchQuery({
          queryKey: ['menuCategories', resId],
          queryFn: () => Promise.resolve([]),
        });
        queryClient.prefetchQuery({
          queryKey: ['menuItems', resId],
          queryFn: () => Promise.resolve([]),
        });
      }
    } catch (error) {
      console.error("Error parsing QR URL:", error);
    }
  }, [parseQRData, handleScan, queryClient]);

  return { handleQRScan };
}
