
import { useEffect } from 'react';
import { useCheckoutState } from './use-checkout-state';
import { useCustomerInfoStorage, useCheckoutStorage, CartItem } from './use-checkout-storage';
import { useCheckoutSubmission } from './use-checkout-submission';
import { MenuItem } from '@/types/menu';

export type { CartItem };

export interface CheckoutData {
  tableId: string | null;
  restaurantId: string | null;
  orderItems: CartItem[];
  name: string;
  email: string;
  phone: string;
  notes: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  orderId: string | null;
  
  // Methods
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setNotes: (notes: string) => void;
  handleSubmitOrder: () => Promise<void>;
}

/**
 * Main checkout hook that composes other checkout-related hooks
 */
export function useCheckout(): CheckoutData {
  // Get form state management
  const {
    name, setName,
    email, setEmail,
    phone, setPhone,
    notes, setNotes,
    isSubmitting, setIsSubmitting,
    isSuccess, setIsSuccess,
    orderId, setOrderId
  } = useCheckoutState();
  
  // Get storage data (table, restaurant, orderItems)
  const { tableId, restaurantId, orderItems } = useCheckoutStorage();
  
  // Load stored customer info from localStorage
  const { customerInfo } = useCustomerInfoStorage();
  
  // Initialize form with stored customer info if available
  useEffect(() => {
    if (customerInfo.name && name === '') {
      setName(customerInfo.name);
    }
    
    if (customerInfo.email && email === '') {
      setEmail(customerInfo.email);
    }
    
    if (customerInfo.phone && phone === '') {
      setPhone(customerInfo.phone);
    }
  }, [customerInfo, name, email, phone, setName, setEmail, setPhone]);
  
  // Handle order submission
  const { submitOrder } = useCheckoutSubmission({
    restaurantId,
    tableId,
    orderItems,
    name,
    email,
    phone,
    notes
  });
  
  // Handle order submission (proxy to the submission hook)
  const handleSubmitOrder = async () => {
    await submitOrder();
  };
  
  return {
    tableId,
    restaurantId,
    orderItems,
    name,
    email,
    phone,
    notes,
    isSubmitting,
    isSuccess,
    orderId,
    setName,
    setEmail,
    setPhone,
    setNotes,
    handleSubmitOrder
  };
}
