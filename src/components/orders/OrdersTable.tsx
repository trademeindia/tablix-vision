
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/services/order/types';
import { Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import GenerateInvoiceButton from '@/components/invoice/GenerateInvoiceButton';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  emptyMessage?: string;
  showInvoiceButton?: boolean;
  onInvoiceGenerated?: (invoiceId: string) => void;
}

const OrdersTable = ({ 
  orders, 
  isLoading, 
  emptyMessage = "No orders found.",
  showInvoiceButton = false,
  onInvoiceGenerated
}: OrdersTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">{emptyMessage}</p>;
  }

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'preparing':
        return <Badge variant="secondary">Preparing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ready</Badge>;
      case 'served':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Served</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.id ? order.id.substring(0, 8) : 'N/A'}
            </TableCell>
            <TableCell>{order.table_number}</TableCell>
            <TableCell>{order.customer_name || (order.customer_id ? 'Customer' : 'Guest')}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {order.created_at ? 
                (showInvoiceButton 
                  ? format(new Date(order.created_at), 'dd MMM HH:mm') 
                  : format(new Date(order.created_at), 'HH:mm')
                ) : 'N/A'}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(order.total_amount || 0)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id || '')}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {showInvoiceButton && (
                  <GenerateInvoiceButton 
                    order={order} 
                    size="sm" 
                    variant="outline" 
                    onSuccess={onInvoiceGenerated}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
