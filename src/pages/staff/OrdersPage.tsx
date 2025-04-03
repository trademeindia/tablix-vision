
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffOrdersHeader from '@/components/staff/orders/StaffOrdersHeader';
import ActiveOrdersContent from '@/components/staff/orders/ActiveOrdersContent';
import CompletedOrdersContent from '@/components/staff/orders/CompletedOrdersContent';
import { useStaffOrders } from '@/hooks/use-staff-orders';

const OrdersPage = () => {
  const { isLoading, activeOrders, completedOrders, handleUpdateStatus } = useStaffOrders();
  
  return (
    <StaffDashboardLayout>
      <StaffOrdersHeader />
      
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
              <ActiveOrdersContent 
                orders={activeOrders} 
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
                orders={completedOrders} 
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
