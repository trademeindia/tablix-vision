
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface QRDataParserResult {
  tableId: string | null;
  restaurantId: string | null;
  parseQRData: (qrData: string) => void;
}

export function useQRDataParser(): QRDataParserResult {
  const location = useLocation();
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Parse restaurant and table from URL params
  useEffect(() => {
    // First check URL parameters
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    // If URL has parameters, use those
    if (tableParam && restaurantParam) {
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
      localStorage.setItem('tableId', tableParam);
      localStorage.setItem('restaurantId', restaurantParam);
      return;
    }
    
    // Check localStorage for returning customers
    const storedTableId = localStorage.getItem('tableId');
    const storedRestaurantId = localStorage.getItem('restaurantId');
    
    if (storedTableId && storedRestaurantId) {
      setTableId(storedTableId);
      setRestaurantId(storedRestaurantId);
    }
  }, [location.search]);

  const parseQRData = (qrData: string) => {
    if (!qrData) return;
    
    try {
      // Try different QR code formats
      
      // Format 1: https://restaurant.app/menu/{restaurantId}?table={tableId}
      try {
        const url = new URL(qrData);
        const pathParts = url.pathname.split('/');
        const qrRestaurantId = pathParts[pathParts.length - 1];
        const qrTableId = url.searchParams.get('table');
        
        if (qrRestaurantId && qrTableId) {
          setRestaurantId(qrRestaurantId);
          setTableId(qrTableId);
          localStorage.setItem('tableId', qrTableId);
          localStorage.setItem('restaurantId', qrRestaurantId);
          return;
        }
      } catch (e) {
        // Not a URL format, try other formats
      }
      
      // Format 2: JSON string {"restaurantId": "xxx", "tableId": "yyy"}
      try {
        const jsonData = JSON.parse(qrData);
        if (jsonData.restaurantId && jsonData.tableId) {
          setRestaurantId(jsonData.restaurantId);
          setTableId(jsonData.tableId);
          localStorage.setItem('tableId', jsonData.tableId);
          localStorage.setItem('restaurantId', jsonData.restaurantId);
          return;
        }
      } catch (e) {
        // Not JSON format, try other formats
      }
      
      // Format 3: Simple text format "restaurantId:tableId"
      const parts = qrData.split(':');
      if (parts.length === 2) {
        const [qrRestaurantId, qrTableId] = parts;
        setRestaurantId(qrRestaurantId);
        setTableId(qrTableId);
        localStorage.setItem('tableId', qrTableId);
        localStorage.setItem('restaurantId', qrRestaurantId);
        return;
      }
      
      // If all format parsing failed
      toast({
        title: "Invalid QR Code",
        description: "The QR code format is not recognized. Please try again.",
        variant: "destructive",
      });
      
    } catch (error) {
      console.error('Error parsing QR data:', error);
    }
  };

  return { tableId, restaurantId, parseQRData };
}
