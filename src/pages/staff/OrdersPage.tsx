
import React, { useState, useEffect } from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading for now
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage table orders</p>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
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
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium">Table 5</p>
                      <p className="text-sm text-slate-500">3 items • $42.50</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium">Table 3</p>
                      <p className="text-sm text-slate-500">2 items • $28.75</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Preparing</Badge>
                  </div>
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
              ) : (
                <p className="text-slate-500">Completed orders will be displayed here.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </StaffDashboardLayout>
  );
};

export default OrdersPage;
