
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callWaiter, getTableWaiterRequests, WaiterRequest } from '@/services/waiterService';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { BellRing, CheckCircle, Clock } from 'lucide-react';
import { useOrderItems } from '@/hooks/use-order-items';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const CallWaiterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table') || '';
  const restaurantId = searchParams.get('restaurant') || '';
  const navigate = useNavigate();
  const { totalItems } = useOrderItems();
  
  const [isLoading, setIsLoading] = useState(false);
  const [recentRequests, setRecentRequests] = useState<WaiterRequest[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  
  // Fetch recent waiter requests
  useEffect(() => {
    if (restaurantId && tableId) {
      const fetchRequests = async () => {
        const requests = await getTableWaiterRequests(restaurantId, tableId);
        setRecentRequests(requests);
      };
      
      fetchRequests();
    }
  }, [restaurantId, tableId]);
  
  // Handle calling a waiter
  const handleCallWaiter = async () => {
    if (!restaurantId || !tableId) {
      toast({
        title: "Error",
        description: "Missing restaurant or table information",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await callWaiter(restaurantId, tableId);
    
    if (result.success) {
      toast({
        title: "Waiter Called",
        description: "A waiter will be with you shortly",
      });
      
      // Refresh the list of requests
      const requests = await getTableWaiterRequests(restaurantId, tableId);
      setRecentRequests(requests);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to call waiter",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };
  
  // Has a pending request
  const hasPendingRequest = recentRequests.some(req => req.status === 'pending');
  
  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!restaurantId || !tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">Invalid Request</h1>
        <p className="text-center text-muted-foreground mb-6">
          Missing restaurant or table information.
        </p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }
  
  return (
    <CustomerMenuLayout 
      tableId={tableId} 
      restaurantId={restaurantId}
      orderItemsCount={totalItems}
    >
      <div className="flex flex-col items-center pt-8 px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <BellRing size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Call for Assistance</h1>
          <p className="text-center text-muted-foreground mb-6">
            Need help from our staff? Tap the button below.
          </p>
          
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handleCallWaiter}
            disabled={isLoading || hasPendingRequest}
          >
            {isLoading ? "Calling..." : hasPendingRequest ? "Waiter on the way" : "Call Waiter"}
          </Button>
          
          {hasPendingRequest && (
            <p className="text-center text-primary mt-4 text-sm">
              Your request is being processed. A staff member will be with you shortly.
            </p>
          )}
        </div>
        
        {recentRequests.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-lg font-medium mb-3">Recent Requests</h2>
            {recentRequests.slice(0, 3).map((request) => (
              <Card key={request.id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {request.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span className="font-medium">
                        {request.status === 'pending' ? 'Pending' : 'Completed'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(request.request_time)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="mt-6 text-sm" 
          onClick={() => setShowInfo(true)}
        >
          How does this work?
        </Button>
      </div>
      
      <Sheet open={showInfo} onOpenChange={setShowInfo}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>How Call Waiter Works</SheetTitle>
            <SheetDescription>
              When you need assistance from our staff, simply press the "Call Waiter" button.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p>
              When you tap "Call Waiter", our staff will receive an immediate notification with your table number.
            </p>
            <p>
              This feature is perfect for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Requesting additional items</li>
              <li>Asking for the check</li>
              <li>Reporting an issue with your meal</li>
              <li>Getting recommendations</li>
              <li>Any other assistance you might need</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-4">
              Our staff is dedicated to providing excellent service. 
              Your request will be attended to as soon as possible.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </CustomerMenuLayout>
  );
};

export default CallWaiterPage;
