
import React, { useState } from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Check, AlertCircle } from 'lucide-react';

// Mock data for kitchen orders - in a real app, this would come from an API
const mockOrders = [
  {
    id: 'ord-001',
    tableNumber: '5',
    items: [
      { id: 'item1', name: 'Grilled Salmon', quantity: 2, notes: 'Medium well, no sauce' },
      { id: 'item2', name: 'Garlic Bread', quantity: 1, notes: 'Extra crispy' }
    ],
    status: 'new',
    timeReceived: '2025-04-06T14:30:00Z'
  },
  {
    id: 'ord-002',
    tableNumber: '8',
    items: [
      { id: 'item3', name: 'Mushroom Risotto', quantity: 1, notes: 'No mushrooms' },
      { id: 'item4', name: 'Caesar Salad', quantity: 1, notes: 'Dressing on the side' }
    ],
    status: 'preparing',
    timeReceived: '2025-04-06T14:25:00Z'
  },
  {
    id: 'ord-003',
    tableNumber: '3',
    items: [
      { id: 'item5', name: 'Beef Burger', quantity: 2, notes: 'Medium rare' },
      { id: 'item6', name: 'French Fries', quantity: 2, notes: 'Extra salt' }
    ],
    status: 'ready',
    timeReceived: '2025-04-06T14:15:00Z'
  }
];

const KitchenPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('new');

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Helper to format time difference
  const getTimeSince = (timeString: string) => {
    const orderTime = new Date(timeString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    return diffMinutes < 60 
      ? `${diffMinutes}m ago` 
      : `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m ago`;
  };

  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        <p className="text-slate-500">Manage food preparation and order status</p>
      </div>

      <Tabs 
        defaultValue="new" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.length > 0 ? filteredOrders.map(order => (
              <Card key={order.id} className={`
                ${order.status === 'new' ? 'border-l-4 border-l-orange-500' : ''}
                ${order.status === 'preparing' ? 'border-l-4 border-l-blue-500' : ''}
                ${order.status === 'ready' ? 'border-l-4 border-l-green-500' : ''}
              `}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
                    <Badge variant={
                      order.status === 'new' ? 'default' : 
                      order.status === 'preparing' ? 'secondary' : 
                      'success'
                    }>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    {getTimeSince(order.timeReceived)}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <li key={item.id} className="border-b pb-2 border-slate-100 last:border-b-0">
                        <div className="font-medium">{item.quantity}× {item.name}</div>
                        {item.notes && (
                          <div className="text-sm text-slate-500 mt-1 italic">{item.notes}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    {order.status === 'new' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                      >
                        Complete Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="h-12 w-12 text-slate-300 mb-2" />
                <h3 className="font-medium text-lg">No Orders</h3>
                <p className="text-slate-500">There are currently no {activeTab !== 'all' ? activeTab : ''} orders to display</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </StaffDashboardLayout>
  );
};

export default KitchenPage;
