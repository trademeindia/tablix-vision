
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RecentOrders from '@/components/dashboard/RecentOrders';
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersTabs from '@/components/orders/OrdersTabs';
import { useOrders } from '@/hooks/use-orders';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderAnalyticsSummary from '@/components/orders/OrderAnalyticsSummary';

const OrdersPage = () => {
  const navigate = useNavigate();
  
  // Mock restaurant ID - in a real app, get this from context or API
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    sortDirection: 'desc' as 'asc' | 'desc'
  });
  
  const { 
    activeOrders, 
    completedOrders, 
    isLoading, 
    isRefreshing, 
    fetchOrders,
    realtimeStatus
  } = useOrders(restaurantId, filters);
  
  const handleInvoiceGenerated = (invoiceId: string) => {
    // Navigate to the invoice details page
    navigate(`/invoices/${invoiceId}`);
  };
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  return (
    <DashboardLayout>
      <OrdersHeader 
        isRefreshing={isRefreshing} 
        onRefresh={fetchOrders}
        realtimeStatus={realtimeStatus}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <OrderAnalyticsSummary restaurantId={restaurantId} />
      </div>
      
      <OrderFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 gap-6">
        <OrdersTabs 
          activeOrders={activeOrders}
          completedOrders={completedOrders}
          isLoading={isLoading}
          onInvoiceGenerated={handleInvoiceGenerated}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
