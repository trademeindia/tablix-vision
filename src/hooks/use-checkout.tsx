
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
  
  // Get customer info storage
  const customerStorage = useCustomerInfoStorage();
  
  // Get table, restaurant, and orderItems from localStorage directly
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
  
  // Get the customerInfo from storage
  const { customerInfo } = customerStorage;
  
  // Setup the order submission handler
  const { submitOrder, isSubmitting: submissionIsSubmitting, isSuccess: submissionIsSuccess, orderId: submissionOrderId } = useCheckoutSubmission({
    restaurantId,
    tableId,
    orderItems,
    name,
    email,
    phone,
    notes
  });

  const handleSubmitOrder = async () => {
    return await submitOrder();
  };

  // Load customer info on initial render
  useEffect(() => {
    // Ensure we have the latest customer info
    const storedInfo = localStorage.getItem('customerInfo');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        if (parsedInfo.name && !name) setName(parsedInfo.name);
        if (parsedInfo.email && !email) setEmail(parsedInfo.email);
        if (parsedInfo.phone && !phone) setPhone(parsedInfo.phone);
      } catch (e) {
        console.error("Error parsing stored customer info:", e);
      }
    }
  }, [name, email, phone, setName, setEmail, setPhone]);

  // Update state from submission results
  useEffect(() => {
    setIsSubmitting(submissionIsSubmitting);
    setIsSuccess(submissionIsSuccess);
    if (submissionOrderId) setOrderId(submissionOrderId);
  }, [submissionIsSubmitting, submissionIsSuccess, submissionOrderId, setIsSubmitting, setIsSuccess, setOrderId]);

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
