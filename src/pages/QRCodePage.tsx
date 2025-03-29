
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRCodeGenerator from '@/components/qrcode/QRCodeGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QRCodePage = () => {
  // In a real app, this would come from authentication or context
  const restaurantId = 'rest123';
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">QR Code Management</h1>
        <p className="text-slate-500">Generate and manage QR codes for your tables</p>
      </div>
      
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate QR Codes</TabsTrigger>
          <TabsTrigger value="manage">Manage QR Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <QRCodeGenerator restaurantId={restaurantId} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>How to Use QR Codes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Generate a unique QR code for each table</h3>
                  <p className="text-sm text-slate-500">
                    Create a QR code with a specific table number to help identify where customers are seated.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">2. Print and place on tables</h3>
                  <p className="text-sm text-slate-500">
                    Download the QR code and print it, then place it in a visible location on each table.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">3. Customers scan to view menu and order</h3>
                  <p className="text-sm text-slate-500">
                    When customers scan the QR code with their smartphone camera, they'll see your digital menu and be able to place orders directly.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">4. Orders are sent to your dashboard</h3>
                  <p className="text-sm text-slate-500">
                    All orders placed will appear in your orders dashboard, with the table number automatically included.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-slate-500">
                Your QR codes will appear here once you generate them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default QRCodePage;
