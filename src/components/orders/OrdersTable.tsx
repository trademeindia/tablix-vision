
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/services/order/types';
import { 
  Eye, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  User, 
  CreditCard,
  Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import GenerateInvoiceButton from '@/components/invoice/GenerateInvoiceButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});

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

  const toggleRow = (orderId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Preparing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Ready</Badge>;
      case 'served':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Served</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Unpaid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
                <TableCell className="p-2 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => toggleRow(order.id || '')}
                  >
                    {expandedRows[order.id || ''] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  #{order.id ? order.id.substring(0, 8) : 'N/A'}
                </TableCell>
                <TableCell>{order.table_number}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-slate-400" />
                    <span>{order.customer_name || (order.customer_id ? 'Customer' : 'Guest')}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-slate-400" />
                    {order.created_at ? 
                      format(new Date(order.created_at), 'dd MMM HH:mm') : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(order.total_amount || 0)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id || '')}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {showInvoiceButton && order.status !== 'cancelled' && (
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
              
              {/* Expandable row content */}
              <TableRow className="hover:bg-slate-50 transition-colors">
                <TableCell colSpan={9} className="p-0">
                  <Collapsible open={expandedRows[order.id || '']} className="w-full">
                    <CollapsibleContent className="p-4 bg-slate-50 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Order Items</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <div>
                                    <span className="font-medium">{item.quantity}x</span> {item.name}
                                    {item.special_instructions && (
                                      <p className="text-xs text-slate-500 ml-5">
                                        Note: {item.special_instructions}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    {formatCurrency(item.price * item.quantity)}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500">No items available</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <h4 className="font-medium text-sm mb-2">Payment Details</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-3 w-3 text-slate-400" />
                                <span>Method: {order.payment_method || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Receipt className="h-3 w-3 text-slate-400" />
                                <span>Reference: {order.payment_reference || 'None'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {order.notes && (
                            <div>
                              <h4 className="font-medium text-sm mb-1">Notes</h4>
                              <p className="text-sm text-slate-600">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
