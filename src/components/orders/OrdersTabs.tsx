
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
}

const OrdersTabs = ({ 
  activeOrders, 
  completedOrders, 
  isLoading, 
  onInvoiceGenerated 
}: OrdersTabsProps) => {
  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <ActiveOrdersTab orders={activeOrders} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="completed">
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
