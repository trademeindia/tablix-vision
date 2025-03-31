
import { useState, useCallback } from 'react';

export const useQRDataParser = () => {
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
  const parseQRData = useCallback((data: string) => {
    console.log("Parsing QR data:", data);
    
    try {
      // Handle different formats of QR data
      
      // Format 1: URL with query parameters
      if (data.includes('?')) {
        const url = new URL(data);
        const params = new URLSearchParams(url.search);
        
        const tableParam = params.get('table');
        const restaurantParam = params.get('restaurant');
        
        if (tableParam) {
          console.log("Found table ID in QR code:", tableParam);
          setTableId(tableParam);
        }
        
        if (restaurantParam) {
          console.log("Found restaurant ID in QR code:", restaurantParam);
          setRestaurantId(restaurantParam);
        }
      } 
      // Format 2: Plain text with format restaurant:table
      else if (data.includes(':')) {
        const [restaurant, table] = data.split(':');
        if (restaurant && table) {
          setRestaurantId(restaurant);
          setTableId(table);
        }
      }
      // Format 3: Just try to use the data directly if nothing else matches
      else if (data) {
        console.log("Using raw QR data:", data);
        // This is a fallback - not ideal
        setRestaurantId(data);
        setTableId("unknown");
      }
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  }, []);
  
  return {
    tableId,
    restaurantId,
    parseQRData,
    clearData: () => {
      setTableId(null);
      setRestaurantId(null);
    }
  };
};
