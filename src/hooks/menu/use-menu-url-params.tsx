
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useMenuUrlParams(parseQRData: (data: string) => void) {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    if (tableParam && restaurantParam) {
      // console.log("Found params in URL:", { table: tableParam, restaurant: restaurantParam });
      parseQRData(window.location.href);
    }
  }, [location.search, parseQRData]);
}
