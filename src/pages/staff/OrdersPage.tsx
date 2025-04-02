
import React, { useState, useEffect } from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, User, Clock, DollarSign, CreditCard, CheckCheck } from 'lucide-react';
import { generateActiveOrders, generateCompletedOrders } from '@/utils/demo-data/order-data';

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  
  // Load demo data
  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo data
      const activeOrdersData = generateActiveOrders(8);
      const completedOrdersData = generateCompletedOrders(12);
      
      setActiveOrders(activeOrdersData);
      setCompletedOrders(completedOrdersData);
      setIsLoading(false);
    };
    
    fetchOrderData();
  }, []);
  
  // Helper function to render the status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'preparing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Ready</Badge>;
      case 'served':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Served</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  // Helper to update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would call an API to update the status
    setActiveOrders(orders => orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // If status is completed, move order to completed list
    if (newStatus === 'completed') {
      const orderToMove = activeOrders.find(order => order.id === orderId);
      if (orderToMove) {
        const updatedOrder = { ...orderToMove, status: 'completed', paymentStatus: 'paid' };
        setActiveOrders(orders => orders.filter(order => order.id !== orderId));
        setCompletedOrders(orders => [updatedOrder, ...orders]);
      }
    }
  };
  
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage table orders</p>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No active orders at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="flex flex-col p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{order.tableNumber}</p>
                            <span className="mx-2 text-slate-300">•</span>
                            <p className="text-sm text-slate-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {order.customerName}
                            </p>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-slate-500">{order.items.length} items</p>
                            <span className="mx-2 text-slate-300">•</span>
                            <p className="text-sm font-medium">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {renderStatusBadge(order.status)}
                          <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Start Preparing
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => handleUpdateStatus(order.id, 'ready')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as Ready
                          </Button>
                        )}
                        
                        {order.status === 'ready' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => handleUpdateStatus(order.id, 'served')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as Served
                          </Button>
                        )}
                        
                        {order.status === 'served' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                            >
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Complete Order
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              Process Payment
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="ml-auto"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : completedOrders.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No completed orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{order.tableNumber}</p>
                          <span className="mx-2 text-slate-300">•</span>
                          <p className="text-sm text-slate-500">{order.customerName}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-slate-500">{order.items.length} items</p>
                          <span className="mx-2 text-slate-300">•</span>
                          <p className="text-xs font-medium flex items-center">
                            <DollarSign className="h-3 w-3 mr-0.5" />
                            {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </StaffDashboardLayout>
  );
};

export default OrdersPage;
