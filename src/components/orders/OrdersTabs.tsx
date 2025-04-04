
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/services/order/types';
import ActiveOrdersTab from './ActiveOrdersTab';
import CompletedOrdersTab from './CompletedOrdersTab';

interface OrdersTabsProps {
  activeOrders: Order[];
  completedOrders: Order[];
  isLoading: boolean;
  onInvoiceGenerated: (invoiceId: string) => void;
  filters: {
    status: string;
    startDate: string;
    endDate: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  };
  onFilterChange: (filters: Partial<OrdersTabsProps['filters']>) => void;
}

const OrdersTabs = ({ 
  activeOrders, 
  completedOrders, 
  isLoading, 
  onInvoiceGenerated,
  filters,
  onFilterChange 
}: OrdersTabsProps) => {
  // Determine the active tab based on the status filter
  let defaultTab = 'active';
  if (filters.status === 'completed' || filters.status === 'served') {
    defaultTab = 'completed';
  }
  
  const handleTabChange = (value: string) => {
    // When switching tabs, update the status filter
    if (value === 'active') {
      onFilterChange({ status: 'all' });
    } else if (value === 'completed') {
      onFilterChange({ status: 'completed' });
    }
  };
  
  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="mt-4">
        <ActiveOrdersTab orders={activeOrders} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-4">
        <CompletedOrdersTab 
          orders={completedOrders} 
          isLoading={isLoading} 
          onInvoiceGenerated={onInvoiceGenerated}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTabs;
