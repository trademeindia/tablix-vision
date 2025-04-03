
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RecentOrders from '@/components/dashboard/RecentOrders';
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersTabs from '@/components/orders/OrdersTabs';
import { useOrders } from '@/hooks/use-orders';

const OrdersPage = () => {
  const navigate = useNavigate();
  
  // Mock restaurant ID - in a real app, get this from context or API
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  const { 
    activeOrders, 
    completedOrders, 
    isLoading, 
    isRefreshing, 
    fetchOrders 
  } = useOrders(restaurantId);
  
  const handleInvoiceGenerated = (invoiceId: string) => {
    // Navigate to the invoice details page
    navigate(`/invoices/${invoiceId}`);
  };
  
  return (
    <DashboardLayout>
      <OrdersHeader isRefreshing={isRefreshing} onRefresh={fetchOrders} />
      
      <div className="grid grid-cols-1 gap-6">
        <RecentOrders />
        
        <OrdersTabs 
          activeOrders={activeOrders}
          completedOrders={completedOrders}
          isLoading={isLoading}
          onInvoiceGenerated={handleInvoiceGenerated}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
