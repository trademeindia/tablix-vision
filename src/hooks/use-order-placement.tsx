
import { useCallback } from 'react';
import { CartItem } from './use-cart-storage';
import { toast } from '@/hooks/use-toast';
import { createOrder } from '@/services/order';
import { useCustomerInfoStorage } from '@/hooks/use-checkout-storage';

/**
 * Hook for placing orders
 */
export function useOrderPlacement(
  orderItems: CartItem[],
  clearOrder: () => void
) {
  const { getCustomerInfo } = useCustomerInfoStorage();
  
  const placeOrder = useCallback(async (
    restaurantId: string, 
    tableId: string, 
    customerInfo?: { name: string; email: string; phone?: string; }
  ): Promise<boolean> => {
    try {
      const customer = customerInfo || getCustomerInfo();
      
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
      
      // Create the order in Supabase
      const order = await createOrder({
        restaurant_id: restaurantId,
        table_number: tableId,
        customer_id: undefined, // This would come from auth in a real implementation
        total_amount: totalAmount,
        items: orderItemsForAPI,
        notes: '',
      });
      
      if (!order) {
        throw new Error("Failed to create order");
      }
      
      // Clear the cart after successful order
      clearOrder();
      
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [orderItems, clearOrder, getCustomerInfo]);
  
  return { placeOrder };
}
