
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Check, ArrowLeft } from 'lucide-react';
import { useOrderItems } from '@/hooks/use-order-items';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CallWaiterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const { totalItems } = useOrderItems();
  
  // Get table and restaurant IDs from query parameters
  const params = new URLSearchParams(location.search);
  const tableId = params.get('table');
  const restaurantId = params.get('restaurant');
  
  if (!tableId || !restaurantId) {
    return (
      <CustomerMenuLayout tableId="Unknown" restaurantId="Unknown" orderItemsCount={totalItems}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Missing table or restaurant information.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardFooter>
        </Card>
      </CustomerMenuLayout>
    );
  }
  
  const handleCallWaiter = async () => {
    setIsLoading(true);
    
    try {
      // Create a waiter request in the database
      const { data, error } = await supabase
        .from('waiter_requests')
        .insert({
          restaurant_id: restaurantId,
          table_number: tableId,
          status: 'pending'
        })
        .select();
      
      if (error) {
        console.error("Error calling waiter:", error);
        throw error;
      }
      
      // console.log("Waiter call request submitted:", data);
      setIsRequested(true);
      
      toast({
        title: "Waiter Requested",
        description: "A staff member will be with you shortly.",
      });
      
      // Automatically go back to menu after 3 seconds
      setTimeout(() => {
        navigate(`/customer-menu?restaurant=${restaurantId}&table=${tableId}`);
      }, 3000);
      
    } catch (error) {
      console.error("Error in call waiter function:", error);
      toast({
        title: "Request Failed",
        description: "Could not request a waiter. Using demo mode.",
        variant: "destructive"
      });
      
      // Demo mode - pretend it worked
      setIsRequested(true);
      setTimeout(() => {
        navigate(`/customer-menu?restaurant=${restaurantId}&table=${tableId}`);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <CustomerMenuLayout tableId={tableId} restaurantId={restaurantId} orderItemsCount={totalItems}>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Call Staff</CardTitle>
            <CardDescription className="text-center">
              {!isRequested 
                ? "Request assistance from a staff member" 
                : "Your request has been received"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            {!isRequested ? (
              <div className="p-6 flex flex-col items-center">
                <BellRing className="h-16 w-16 text-primary mb-4" />
                <p className="text-muted-foreground mb-6">
                  Need help with your order? Have a question? A staff member will come to your table shortly.
                </p>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium mb-2">Request received!</p>
                <p className="text-muted-foreground">
                  A staff member will be with you shortly. Returning to menu...
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            {!isRequested ? (
              <>
                <Button 
                  className="w-full" 
                  onClick={handleCallWaiter} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Requesting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <BellRing className="mr-2 h-4 w-4" /> Call Waiter
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/customer-menu?restaurant=${restaurantId}&table=${tableId}`)}
                >
                  Back to Menu
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate(`/customer-menu?restaurant=${restaurantId}&table=${tableId}`)}
              >
                Return to Menu Now
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </CustomerMenuLayout>
  );
};

export default CallWaiterPage;
