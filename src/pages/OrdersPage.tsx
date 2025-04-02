
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Receipt, Clock } from 'lucide-react';
import { getRestaurantOrders } from '@/services/order';
import { Order } from '@/services/order/types';
import GenerateInvoiceButton from '@/components/invoice/GenerateInvoiceButton';
import { format } from 'date-fns';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock restaurant ID - in a real app, get this from context or API
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getRestaurantOrders(restaurantId);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [restaurantId]);
  
  const handleViewOrder = (orderId: string) => {
    // Navigate to order details page
    navigate(`/orders/${orderId}`);
  };
  
  const handleInvoiceGenerated = (invoiceId: string) => {
    // Navigate to the invoice details page
    navigate(`/invoices/${invoiceId}`);
  };
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'preparing':
        return <Badge variant="secondary">Preparing</Badge>;
      case 'ready':
        return <Badge variant="warning">Ready</Badge>;
      case 'served':
        return <Badge variant="primary">Served</Badge>;
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
  
  const completedOrders = orders.filter(order => 
    order.status === 'completed' || order.status === 'served'
  );
  
  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'served' && order.status !== 'cancelled'
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage restaurant orders</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <RecentOrders />
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : activeOrders.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No active orders at the moment.</p>
                ) : (
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
                      {activeOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id ? order.id.substring(0, 8) : 'N/A'}
                          </TableCell>
                          <TableCell>{order.table_number}</TableCell>
                          <TableCell>{order.customer_id ? 'Customer' : 'Guest'}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {order.created_at ? format(new Date(order.created_at), 'HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(order.total_amount)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id || '')}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : completedOrders.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No completed orders found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id ? order.id.substring(0, 8) : 'N/A'}
                          </TableCell>
                          <TableCell>{order.table_number}</TableCell>
                          <TableCell>{order.customer_id ? 'Customer' : 'Guest'}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.created_at ? format(new Date(order.created_at), 'dd MMM HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(order.total_amount)}</TableCell>
                          <TableCell className="text-right flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id || '')}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <GenerateInvoiceButton 
                              order={order} 
                              size="sm" 
                              variant="outline" 
                              onSuccess={handleInvoiceGenerated}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
