
import React, { useState } from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffOrdersHeader from '@/components/staff/orders/StaffOrdersHeader';
import ActiveOrdersContent from '@/components/staff/orders/ActiveOrdersContent';
import CompletedOrdersContent from '@/components/staff/orders/CompletedOrdersContent';
import { useStaffOrders } from '@/hooks/use-staff-orders';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { isLoading, activeOrders, completedOrders, handleUpdateStatus, realtimeStatus } = useStaffOrders();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter orders based on search term
  const filteredActiveOrders = activeOrders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompletedOrders = completedOrders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <StaffDashboardLayout>
      <StaffOrdersHeader 
        realtimeStatus={realtimeStatus}
      />
      
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-10"
          placeholder="Search orders by ID, customer or table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                Require Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Preparing</p>
                <p className="text-2xl font-bold">
                  {activeOrders.filter(order => order.status === 'preparing').length}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                In Kitchen
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Ready to Serve</p>
                <p className="text-2xl font-bold">
                  {activeOrders.filter(order => order.status === 'ready').length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 border border-green-200">
                Ready
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Orders ({filteredActiveOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({filteredCompletedOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveOrdersContent 
                orders={filteredActiveOrders} 
                isLoading={isLoading} 
                handleUpdateStatus={handleUpdateStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <CompletedOrdersContent 
                orders={filteredCompletedOrders} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </StaffDashboardLayout>
  );
};

export default OrdersPage;
