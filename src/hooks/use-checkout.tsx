import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderItem, createOrder, convertCartItemsToOrderItems } from '@/services/order';
import { MenuItem } from '@/types/menu';
import { createOrUpdateCustomer } from '@/services/customerService';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

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

export function useCheckout(): CheckoutData {
  const location = useLocation();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    if (tableParam && restaurantParam) {
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
    } else {
      const storedTableId = localStorage.getItem('tableId');
      const storedRestaurantId = localStorage.getItem('restaurantId');
      
      if (storedTableId && storedRestaurantId) {
        setTableId(storedTableId);
        setRestaurantId(storedRestaurantId);
      }
    }
    
    const storedOrderItems = localStorage.getItem('orderItems');
    if (storedOrderItems) {
      try {
        setOrderItems(JSON.parse(storedOrderItems));
      } catch (error) {
        console.error('Error parsing order items:', error);
      }
    }

    const storedCustomer = localStorage.getItem('customerInfo');
    if (storedCustomer) {
      try {
        const customerInfo = JSON.parse(storedCustomer);
        setName(customerInfo.name || '');
        setEmail(customerInfo.email || '');
        setPhone(customerInfo.phone || '');
      } catch (error) {
        console.error('Error parsing customer info:', error);
      }
    }
  }, [location.search]);
  
  const handleSubmitOrder = async () => {
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
      const customerData = {
        name,
        email: email || undefined,
        phone: phone || undefined,
      };
      
      const customer = await createOrUpdateCustomer(customerData);
      
      if (!customer) {
        throw new Error("Could not create or update customer");
      }

      localStorage.setItem('customerInfo', JSON.stringify(customerData));
      
      const orderItemsData = convertCartItemsToOrderItems(orderItems);
      
      const order = await createOrder({
        customer_id: customer.id,
        restaurant_id: restaurantId,
        table_number: tableId,
        total_amount: orderItems.reduce(
          (total, { item, quantity }) => total + item.price * quantity, 
          0
        ),
        notes: notes || undefined,
        items: orderItemsData,
      });
      
      if (!order) {
        throw new Error("Could not create order");
      }
      
      setOrderId(order.id || null);
      
      localStorage.removeItem('orderItems');
      
      setIsSuccess(true);
      
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
