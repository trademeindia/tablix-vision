import { useEffect } from 'react';
import { useCheckoutState } from './use-checkout-state';
import { useCustomerInfoStorage } from './use-checkout-storage';
import { useCheckoutSubmission } from './use-checkout-submission';
import { MenuItem } from '@/types/menu';
import { CartItem } from './use-cart-storage';

export type { CartItem };

interface CheckoutData {
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
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setNotes: (notes: string) => void;
  handleSubmitOrder: () => Promise<boolean>;
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
  const customerStorage = useCustomerInfoStorage();
  const tableId = localStorage.getItem('tableId');
  const restaurantId = localStorage.getItem('restaurantId');
  
  // Load order items from localStorage
  const orderItemsStr = localStorage.getItem('orderItems');
  let orderItems: CartItem[] = [];
  
  if (orderItemsStr) {
    try {
      orderItems = JSON.parse(orderItemsStr);
    } catch (e) {
      console.error("Error parsing stored order items:", e);
    }
  }
  
  // Load stored customer info from localStorage
  const { customerInfo } = customerStorage;
  
  // Handle order submission
  const { handleSubmitOrder } = useCheckoutSubmission(
    restaurantId,
    tableId,
    orderItems,
    customerInfo,
    setIsSubmitting,
    setIsSuccess,
    setOrderId
  );

  useEffect(() => {
    // Load customer info from localStorage on initial render
    customerStorage.loadCustomerInfo();
  }, [customerStorage]);

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
