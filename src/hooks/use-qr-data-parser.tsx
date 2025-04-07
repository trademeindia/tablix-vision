
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface QRDataParserResult {
  tableId: string | null;
  restaurantId: string | null;
  parseQRData: (qrData: string) => void;
}

export function useQRDataParser(): QRDataParserResult {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Parse restaurant and table from URL params
  useEffect(() => {
    // First check URL parameters
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    console.log("Checking URL parameters:", { tableParam, restaurantParam });
    
    // If URL has parameters, use those
    if (tableParam && restaurantParam) {
      console.log("Using URL parameters for restaurant/table:", { restaurantParam, tableParam });
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
      console.log("Using stored restaurant/table:", { restaurantId: storedRestaurantId, tableId: storedTableId });
      setTableId(storedTableId);
      setRestaurantId(storedRestaurantId);
      
      // Redirect to customer-menu with parameters if we're not already there
      if (!location.pathname.includes('/customer-menu') && !location.pathname.includes('/customer/menu')) {
        navigate(`/customer-menu?restaurant=${storedRestaurantId}&table=${storedTableId}`, { replace: true });
      }
    }
  }, [location.search, location.pathname, navigate]);

  const parseQRData = (qrData: string) => {
    if (!qrData) return;
    
    try {
      console.log("Parsing QR data:", qrData);
      
      // Try different QR code formats
      
      // Format 1: URL with query parameters (e.g. https://domain.com/customer-menu?restaurant=xyz&table=123)
      try {
        const url = new URL(qrData);
        const params = new URLSearchParams(url.search);
        const qrTableId = params.get('table');
        const qrRestaurantId = params.get('restaurant');
        
        if (qrRestaurantId && qrTableId) {
          console.log("Found URL parameters:", { restaurant: qrRestaurantId, table: qrTableId });
          setRestaurantId(qrRestaurantId);
          setTableId(qrTableId);
          localStorage.setItem('tableId', qrTableId);
          localStorage.setItem('restaurantId', qrRestaurantId);
          
          // Redirect to customer-menu with parameters
          navigate(`/customer-menu?restaurant=${qrRestaurantId}&table=${qrTableId}`, { replace: true });
          
          toast({
            title: "QR Code Scanned",
            description: "Loading menu for table " + qrTableId,
          });
          
          return;
        }
      } catch (e) {
        console.log("Not a URL format, trying other formats");
      }
      
      // Format 2: Old URL path format (https://restaurant.app/menu/{restaurantId}?table={tableId})
      try {
        const url = new URL(qrData);
        const pathParts = url.pathname.split('/');
        const qrRestaurantId = pathParts[pathParts.length - 1];
        const qrTableId = url.searchParams.get('table');
        
        if (qrRestaurantId && qrTableId) {
          console.log("Found path format:", { restaurant: qrRestaurantId, table: qrTableId });
          setRestaurantId(qrRestaurantId);
          setTableId(qrTableId);
          localStorage.setItem('tableId', qrTableId);
          localStorage.setItem('restaurantId', qrRestaurantId);
          
          // Redirect to customer-menu with parameters
          navigate(`/customer-menu?restaurant=${qrRestaurantId}&table=${qrTableId}`, { replace: true });
          
          toast({
            title: "QR Code Scanned",
            description: "Loading menu for table " + qrTableId,
          });
          
          return;
        }
      } catch (e) {
        console.log("Not a path format URL, trying other formats");
      }
      
      // Format 3: JSON string {"restaurantId": "xxx", "tableId": "yyy"}
      try {
        const jsonData = JSON.parse(qrData);
        if (jsonData.restaurantId && jsonData.tableId) {
          console.log("Found JSON format:", jsonData);
          setRestaurantId(jsonData.restaurantId);
          setTableId(jsonData.tableId);
          localStorage.setItem('tableId', jsonData.tableId);
          localStorage.setItem('restaurantId', jsonData.restaurantId);
          
          // Redirect to customer-menu with parameters
          navigate(`/customer-menu?restaurant=${jsonData.restaurantId}&table=${jsonData.tableId}`, { replace: true });
          
          toast({
            title: "QR Code Scanned",
            description: "Loading menu for table " + jsonData.tableId,
          });
          
          return;
        }
      } catch (e) {
        console.log("Not JSON format, trying other formats");
      }
      
      // Format 4: Simple text format "restaurantId:tableId"
      const parts = qrData.split(':');
      if (parts.length === 2) {
        const [qrRestaurantId, qrTableId] = parts;
        console.log("Found simple text format:", { restaurant: qrRestaurantId, table: qrTableId });
        setRestaurantId(qrRestaurantId);
        setTableId(qrTableId);
        localStorage.setItem('tableId', qrTableId);
        localStorage.setItem('restaurantId', qrRestaurantId);
        
        // Redirect to customer-menu with parameters
        navigate(`/customer-menu?restaurant=${qrRestaurantId}&table=${qrTableId}`, { replace: true });
        
        toast({
          title: "QR Code Scanned",
          description: "Loading menu for table " + qrTableId,
        });
        
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
      toast({
        title: "Error Reading QR Code",
        description: "There was a problem processing the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { tableId, restaurantId, parseQRData };
}
