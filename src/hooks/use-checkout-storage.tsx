
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem } from '@/types/menu';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CheckoutStorageState {
  tableId: string | null;
  restaurantId: string | null;
  orderItems: CartItem[];
}

/**
 * Hook to manage checkout data from URL parameters and localStorage
 */
export function useCheckoutStorage(): CheckoutStorageState {
  const location = useLocation();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
  useEffect(() => {
    // First try to get params from URL
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    if (tableParam && restaurantParam) {
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
      
      // Store in localStorage for persistence
      localStorage.setItem('tableId', tableParam);
      localStorage.setItem('restaurantId', restaurantParam);
    } else {
      // If not in URL, try from localStorage
      const storedTableId = localStorage.getItem('tableId');
      const storedRestaurantId = localStorage.getItem('restaurantId');
      
      if (storedTableId && storedRestaurantId) {
        setTableId(storedTableId);
        setRestaurantId(storedRestaurantId);
      }
    }
    
    // Get order items from localStorage
    const storedOrderItems = localStorage.getItem('orderItems');
    if (storedOrderItems) {
      try {
        setOrderItems(JSON.parse(storedOrderItems));
      } catch (error) {
        console.error('Error parsing order items:', error);
      }
    }
  }, [location.search]);
  
  return {
    tableId,
    restaurantId,
    orderItems
  };
}

/**
 * Hook to get and store customer information in localStorage
 */
export function useCustomerInfoStorage() {
  const [storedCustomerInfo, setStoredCustomerInfo] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customerInfo');
    if (storedCustomer) {
      try {
        const customerInfo = JSON.parse(storedCustomer);
        setStoredCustomerInfo(customerInfo);
      } catch (error) {
        console.error('Error parsing customer info:', error);
      }
    }
  }, []);
  
  return storedCustomerInfo;
}

/**
 * Hook to save customer info to localStorage
 */
export function useSaveCustomerInfo() {
  const saveCustomerInfo = (customerData: { name: string; email?: string; phone?: string }) => {
    localStorage.setItem('customerInfo', JSON.stringify(customerData));
  };
  
  return { saveCustomerInfo };
}
