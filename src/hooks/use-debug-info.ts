
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useDebugInfo(tableId: string | null, restaurantId: string | null) {
  const location = useLocation();
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<{
    scannedQrData: string | null;
    parsedTableId: string | null;
    parsedRestaurantId: string | null;
    locationSearch: string;
    locationPathname: string;
  }>({
    scannedQrData: null,
    parsedTableId: null,
    parsedRestaurantId: null,
    locationSearch: location.search,
    locationPathname: location.pathname,
  });
  
  // Update debug info when data changes
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      parsedTableId: tableId,
      parsedRestaurantId: restaurantId,
      locationSearch: location.search,
      locationPathname: location.pathname,
    }));
  }, [tableId, restaurantId, location.search, location.pathname]);

  const updateScannedQrData = (data: string) => {
    setDebugInfo(prev => ({
      ...prev,
      scannedQrData: data
    }));
  };

  // Determine if we should show debug info
  const showDebugInfo = process.env.NODE_ENV === 'development' || new URLSearchParams(location.search).has('debug');
  
  return {
    debugInfo,
    updateScannedQrData,
    showDebugInfo
  };
}
