
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock } from 'lucide-react';

const KitchenPage = () => {
  // This would typically fetch data from your backend
  const pendingOrders = [
    {
      id: 'order123',
      tableNumber: '5',
      timeReceived: '10:25 AM',
      items: [
        { id: 'item1', name: 'Grilled Salmon', quantity: 2, notes: 'Medium rare' },
        { id: 'item2', name: 'Caesar Salad', quantity: 1, notes: 'No croutons' },
      ]
    },
    {
      id: 'order124',
      tableNumber: '3',
      timeReceived: '10:30 AM',
      items: [
        { id: 'item3', name: 'Chicken Pasta', quantity: 1, notes: 'Extra sauce' },
        { id: 'item4', name: 'Garlic Bread', quantity: 1, notes: '' },
      ]
    }
  ];

  const handleOrderComplete = (orderId: string) => {
    console.log(`Order ${orderId} marked as complete`);
    // In a real app, you would call an API to update the order status
  };
  
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        <p className="text-slate-500">Manage food preparation and order fulfillment</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <ChefHat className="mr-2 h-5 w-5" /> 
              Pending Orders
            </CardTitle>
            <Badge className="bg-orange-500">{pendingOrders.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => (
                <Card key={order.id} className="border border-slate-200">
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Table {order.tableNumber}</h3>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.timeReceived}
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-200">
                        Order #{order.id.slice(-3)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.name} <span className="text-slate-500">×{item.quantity}</span></div>
                            {item.notes && <div className="text-xs text-slate-500">{item.notes}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleOrderComplete(order.id)}
                      >
                        Mark Ready
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No pending orders</p>
                <p className="text-sm text-slate-400">All current orders have been prepared</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StaffDashboardLayout>
  );
};

export default KitchenPage;
