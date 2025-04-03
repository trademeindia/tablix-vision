
import { useState, useEffect } from 'react';

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

// Customer info storage hook
export function useCustomerInfoStorage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});

  // Load customer info from localStorage when component mounts
  useEffect(() => {
    loadCustomerInfo();
  }, []);

  // Load customer info from localStorage
  const loadCustomerInfo = () => {
    const storedInfo = localStorage.getItem('customerInfo');
    if (storedInfo) {
      try {
        setCustomerInfo(JSON.parse(storedInfo));
      } catch (e) {
        console.error("Error parsing stored customer info:", e);
      }
    }
  };

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
    clearCustomerInfo,
    loadCustomerInfo
  };
}

// For backward compatibility
export const useSaveCustomerInfo = useCustomerInfoStorage;
