
import { useState, useEffect } from 'react';
import { generateActiveOrders, generateCompletedOrders } from './order-data';
import { Order } from '@/services/order/types';

// Convert demo data format to the application's Order format
const convertDemoOrderToAppFormat = (demoOrder: any): Order => {
  return {
    id: demoOrder.id,
    table_number: demoOrder.tableNumber,
    customer_name: demoOrder.customerName,
    status: demoOrder.status,
    payment_status: demoOrder.paymentStatus,
    created_at: demoOrder.createdAt,
    updated_at: new Date().toISOString(),
    total_amount: demoOrder.total,
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    items: demoOrder.items.map((item: any) => ({
      id: item.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      special_instructions: item.notes,
      image_url: item.menuItem.image
    })),
    notes: demoOrder.items.some((item: any) => item.notes) ? 'Special instructions added' : undefined,
    payment_method: Math.random() > 0.5 ? 'Credit Card' : 'Cash',
    payment_reference: Math.random().toString(36).substring(2, 10).toUpperCase(),
  };
};

export function useDemoOrders() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'error'>('connected');
  
  // Generate and set demo data
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const demoActiveOrders = generateActiveOrders(8).map(convertDemoOrderToAppFormat);
      const demoCompletedOrders = generateCompletedOrders(15).map(convertDemoOrderToAppFormat);
      
      setActiveOrders(demoActiveOrders);
      setCompletedOrders(demoCompletedOrders);
      setIsLoading(false);
    }, 800); // Simulating network delay
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate refresh functionality
  const fetchOrders = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const demoActiveOrders = generateActiveOrders(8).map(convertDemoOrderToAppFormat);
      const demoCompletedOrders = generateCompletedOrders(15).map(convertDemoOrderToAppFormat);
      
      setActiveOrders(demoActiveOrders);
      setCompletedOrders(demoCompletedOrders);
      setIsLoading(false);
    }, 800);
  };
  
  return {
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing: isLoading,
    count: activeOrders.length + completedOrders.length,
    fetchOrders,
    realtimeStatus
  };
}
