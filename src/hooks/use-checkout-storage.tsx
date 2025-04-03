
import { useState, useEffect } from 'react';

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface CartItem {
  item: any;
  quantity: number;
}

// Customer info storage hook
export function useCustomerInfoStorage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});

  // Load customer info from localStorage when component mounts
  useEffect(() => {
    const storedInfo = localStorage.getItem('customerInfo');
    if (storedInfo) {
      try {
        setCustomerInfo(JSON.parse(storedInfo));
      } catch (e) {
        console.error("Error parsing stored customer info:", e);
      }
    }
  }, []);

  // Update localStorage whenever customer info changes
  useEffect(() => {
    if (Object.keys(customerInfo).length > 0) {
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  const saveCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);
  };

  const getCustomerInfo = (): CustomerInfo => {
    return customerInfo;
  };

  const clearCustomerInfo = () => {
    setCustomerInfo({});
    localStorage.removeItem('customerInfo');
  };

  return {
    customerInfo,
    saveCustomerInfo,
    getCustomerInfo,
    clearCustomerInfo
  };
}

// Alias function to match expected API in checkout flow
export const useSaveCustomerInfo = useCustomerInfoStorage;

// Cart storage functions
export function useCheckoutStorage() {
  // Table and restaurant ID from localStorage or URL params
  const tableId = localStorage.getItem('tableId');
  const restaurantId = localStorage.getItem('restaurantId');
  
  // Load cart items from localStorage
  const orderItemsStr = localStorage.getItem('orderItems');
  let orderItems: CartItem[] = [];
  
  if (orderItemsStr) {
    try {
      orderItems = JSON.parse(orderItemsStr);
    } catch (e) {
      console.error("Error parsing stored order items:", e);
    }
  }
  
  return {
    tableId,
    restaurantId,
    orderItems
  };
}
