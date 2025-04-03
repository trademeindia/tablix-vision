
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/services/order/types';
import OrdersTable from './OrdersTable';

interface ActiveOrdersTabProps {
  orders: Order[];
  isLoading: boolean;
}

const ActiveOrdersTab = ({ orders, isLoading }: ActiveOrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTable 
          orders={orders} 
          isLoading={isLoading} 
          emptyMessage="No active orders at the moment."
        />
      </CardContent>
    </Card>
  );
};

export default ActiveOrdersTab;
