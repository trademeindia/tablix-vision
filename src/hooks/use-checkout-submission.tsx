
import { useState } from 'react';
import { createOrUpdateCustomer } from '@/services/customerService';
import { createOrder, convertCartItemsToOrderItems } from '@/services/order';
import { calculateLoyaltyPoints, addLoyaltyPoints } from '@/services/loyaltyService';
import { toast } from '@/hooks/use-toast';
import { CartItem } from './use-checkout-storage';
import { useSaveCustomerInfo } from './use-checkout-storage';

interface SubmitOrderOptions {
  restaurantId: string | null;
  tableId: string | null;
  orderItems: CartItem[];
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface SubmitOrderResult {
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
}: SubmitOrderOptions): SubmitOrderResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { saveCustomerInfo } = useSaveCustomerInfo();
  
  const submitOrder = async () => {
    // Validation checks
    if (!restaurantId || !tableId) {
      toast({
        title: "Error",
        description: "Missing restaurant or table information",
        variant: "destructive",
      });
      return;
    }
    
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to your order",
        variant: "destructive",
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create or update customer
      const customerData = {
        name,
        email: email || undefined,
        phone: phone || undefined,
      };
      
      const customer = await createOrUpdateCustomer(customerData);
      
      if (!customer) {
        throw new Error("Could not create or update customer");
      }

      // Save customer info for future orders
      saveCustomerInfo(customerData);
      
      // Convert cart items to order items
      const orderItemsData = convertCartItemsToOrderItems(orderItems);
      
      // Calculate total amount
      const totalAmount = orderItems.reduce(
        (total, { item, quantity }) => total + item.price * quantity, 
        0
      );
      
      // Create the order
      const order = await createOrder({
        customer_id: customer.id,
        restaurant_id: restaurantId,
        table_number: tableId,
        total_amount: totalAmount,
        notes: notes || undefined,
        items: orderItemsData,
      });
      
      if (!order) {
        throw new Error("Could not create order");
      }
      
      setOrderId(order.id || null);
      
      // Calculate and add loyalty points
      if (customer.id) {
        const pointsEarned = calculateLoyaltyPoints(totalAmount);
        if (pointsEarned > 0) {
          await addLoyaltyPoints(customer.id, pointsEarned);
          toast({
            title: "Loyalty Points Earned!",
            description: `You earned ${pointsEarned} loyalty points with this order.`,
          });
        }
      }
      
      // Clear the cart
      localStorage.removeItem('orderItems');
      
      setIsSuccess(true);
      
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed.",
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
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
