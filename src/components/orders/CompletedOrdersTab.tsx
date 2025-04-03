
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/services/order/types';
import OrdersTable from './OrdersTable';

interface CompletedOrdersTabProps {
  orders: Order[];
  isLoading: boolean;
  onInvoiceGenerated: (invoiceId: string) => void;
}

const CompletedOrdersTab = ({ orders, isLoading, onInvoiceGenerated }: CompletedOrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTable 
          orders={orders} 
          isLoading={isLoading} 
          emptyMessage="No completed orders found."
          showInvoiceButton={true}
          onInvoiceGenerated={onInvoiceGenerated}
        />
      </CardContent>
    </Card>
  );
};

export default CompletedOrdersTab;
