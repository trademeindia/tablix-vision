
import { useState } from 'react';
import { createOrder } from '@/services/order';
import { useCustomerInfoStorage } from './use-checkout-storage';
import { CartItem } from './use-cart-storage';
import { toast } from './use-toast';

interface UseCheckoutSubmissionProps {
  restaurantId: string | null;
  tableId: string | null;
  orderItems: CartItem[];
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface UseCheckoutSubmissionResult {
  isSubmitting: boolean;
  isSuccess: boolean;
  orderId: string | null;
  submitOrder: () => Promise<boolean>;
}

export function useCheckoutSubmission({
  restaurantId,
  tableId,
  orderItems,
  name,
  email,
  phone,
  notes
}: UseCheckoutSubmissionProps): UseCheckoutSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { getCustomerInfo } = useCustomerInfoStorage();

  const submitOrder = async (): Promise<boolean> => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setOrderId(null);

    try {
      if (!restaurantId || !tableId) {
        toast({
          title: "Missing Information",
          description: "Restaurant or table information is missing",
          variant: "destructive"
        });
        return false;
      }

      if (orderItems.length === 0) {
        toast({
          title: "Empty Order",
          description: "Your order is empty. Please add items before placing an order.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Processing Order",
        description: "Please wait while we process your order...",
      });

      // Prepare order items for the API
      const orderItemsForAPI = orderItems.map(({ item, quantity }) => ({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
      }));

      // Calculate total amount
      const totalAmount = orderItems.reduce(
        (total, { item, quantity }) => total + (item.price * quantity),
        0
      );

      // Get customer info
      const customerInfo = { name, email, phone };
      const customer = customerInfo || getCustomerInfo();

      // Create the order in Supabase
      const { user } = useAuth();
      const order = await createOrder({
        restaurant_id: restaurantId,
        table_number: tableId,
        customer_id: user?.id, // Use the user ID from the auth context
        total_amount: totalAmount,
        items: orderItemsForAPI,
        notes: notes,
      });

      if (!order) {
        throw new Error("Failed to create order");
      }

      // Set the order ID
      setOrderId(order.id || null);
      setIsSuccess(true);

      // Save customer info for future visits
      localStorage.setItem('customerInfo', JSON.stringify({ name, email, phone }));

      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      setIsSuccess(false);
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSuccess,
    orderId,
    submitOrder
  };
}
