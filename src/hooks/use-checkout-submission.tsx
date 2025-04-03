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
  submitOrder: () => Promise<void>;
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

  const submitOrder = async () => {
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
        return;
      }

      if (orderItems.length === 0) {
        toast({
          title: "Empty Order",
          description: "Your order is empty. Please add items before placing an order.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Processing Order",
        description: "Please wait while we process your order...",
      });

      // Prepare order items for the API
      const orderItemsForAPI = orderItems.map(({ item, quantity }) => ({
        menu_item_id: item.item.id,
        name: item.item.name,
        price: item.item.price,
        quantity: quantity,
      }));

      // Calculate total amount
      const totalAmount = orderItems.reduce(
        (total, { item, quantity }) => total + (item.item.price * quantity),
        0
      );

      // Get customer info
      const customerInfo = { name, email, phone };
      const customer = customerInfo || getCustomerInfo();

      // Create the order in Supabase
      const order = await createOrder({
        restaurant_id: restaurantId,
        table_number: tableId,
        customer_id: undefined, // This would come from auth in a real implementation
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

      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      setIsSuccess(false);
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
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
