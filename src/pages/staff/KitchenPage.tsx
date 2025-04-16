
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Check, Utensils } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodItemCheckbox } from '@/components/ui/food-item-checkbox';
import { useKitchenOrderItems } from '@/hooks/kitchen/use-kitchen-order-items';

const KitchenPage = () => {
  const { 
    pendingOrders, 
    preparingOrders, 
    isLoading, 
    toggleItemCompletion, 
    updateOrderStatus,
    areAllItemsCompleted
  } = useKitchenOrderItems();
  
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kitchen View</h1>
        <p className="text-slate-500">View and manage food preparation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">New Orders</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">{pendingOrders.length}</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{pendingOrders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">In Preparation</p>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">{preparingOrders.length}</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{preparingOrders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Average Time</p>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold mt-2">18.5 min</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Orders ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="preparing">In Preparation ({preparingOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-36 w-full" />
                </div>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500">No new orders waiting for preparation.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingOrders.map(order => (
                    <Card key={order.id} className="border-blue-200">
                      <CardHeader className="pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{order.tableNumber}</CardTitle>
                          <p className="text-sm text-slate-500">Order #{order.id.split('-')[1]}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">New</Badge>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-1 border-b border-slate-100">
                              <div className="flex items-center">
                                <Utensils className="h-3 w-3 mr-2 text-slate-400" />
                                <span>{item.quantity}× {item.menuItem.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-sm text-slate-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          
                          <Button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            size="sm"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Start Preparing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preparing">
          <Card>
            <CardHeader>
              <CardTitle>In Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-36 w-full" />
                </div>
              ) : preparingOrders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500">No orders currently in preparation.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {preparingOrders.map(order => (
                    <Card key={order.id} className="border-amber-200">
                      <CardHeader className="pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{order.tableNumber}</CardTitle>
                          <p className="text-sm text-slate-500">Order #{order.id.split('-')[1]}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">Preparing</Badge>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-1 border-b border-slate-100">
                              <div className="flex items-center">
                                <Utensils className="h-3 w-3 mr-2 text-slate-400" />
                                <span>{item.quantity}× {item.menuItem.name}</span>
                              </div>
                              <FoodItemCheckbox 
                                checked={item.completed}
                                onChange={() => toggleItemCompletion(order.id, item.id)}
                                aria-label={`Mark ${item.menuItem.name} as prepared`}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-sm text-slate-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          
                          <Button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            size="sm"
                            disabled={!areAllItemsCompleted(order.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark Ready
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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

export default KitchenPage;
