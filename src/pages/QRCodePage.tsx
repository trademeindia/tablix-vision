
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRCodeGenerator from '@/components/qrcode/QRCodeGenerator';
import QRCodeList from '@/components/qrcode/QRCodeList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QRCodePage = () => {
  const [restaurantId, setRestaurantId] = useState('00000000-0000-0000-0000-000000000000');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to get a real restaurant ID if the user is authenticated
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we have a logged in user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          setError("Authentication error. Please log in again.");
          return;
        }
        
        if (!userData?.user) {
          console.log("No authenticated user found, using default restaurant ID");
          setError("You need to be logged in to manage QR codes. Using demo mode.");
          return;
        }
        
        // Try to get a restaurant owned by this user
        const { data: restaurants, error: restError } = await supabase
          .from('restaurants')
          .select('id, name')
          .eq('owner_id', userData.user.id)
          .limit(1);
        
        if (restError) {
          console.error("Error fetching restaurant:", restError);
          setError("Failed to load restaurant data.");
          return;
        }
        
        if (restaurants && restaurants.length > 0) {
          console.log("Found user's restaurant:", restaurants[0].id);
          setRestaurantId(restaurants[0].id);
        } else {
          console.log("No restaurants found for user, using default ID");
          setError("No restaurant found. Create a restaurant first for real QR codes.");
        }
      } catch (error) {
        console.error("Error in fetchRestaurantId:", error);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantId();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">QR Code Management</h1>
        <p className="text-slate-500">Generate and manage QR codes for your tables</p>
      </div>
      
      {error && (
        <Alert className="mb-6" variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
          <QRCodeList restaurantId={restaurantId} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default QRCodePage;
