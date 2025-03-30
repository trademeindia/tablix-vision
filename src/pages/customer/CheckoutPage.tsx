
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ChevronLeft, CreditCard, Check } from 'lucide-react';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import { MenuItem } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Calculate total price
  const totalPrice = orderItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity, 
    0
  );
  
  // Load data from localStorage or URL params
  useEffect(() => {
    // Get table and restaurant IDs from URL params
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    if (tableParam && restaurantParam) {
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
    } else {
      // Try to get from localStorage
      const storedTableId = localStorage.getItem('tableId');
      const storedRestaurantId = localStorage.getItem('restaurantId');
      
      if (storedTableId && storedRestaurantId) {
        setTableId(storedTableId);
        setRestaurantId(storedRestaurantId);
      }
    }
    
    // Get order items from localStorage
    const storedOrderItems = localStorage.getItem('orderItems');
    if (storedOrderItems) {
      try {
        setOrderItems(JSON.parse(storedOrderItems));
      } catch (error) {
        console.error('Error parsing order items:', error);
      }
    }
  }, [location.search]);
  
  const handleSubmitOrder = async () => {
    if (!restaurantId || !tableId) {
      toast({
        title: "Error",
        description: "Missing restaurant or table information",
        variant: "destructive",
      });
      return;
    }
    
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to your order",
        variant: "destructive",
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here we would normally submit to Supabase
      // For now, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear order items from localStorage
      localStorage.removeItem('orderItems');
      
      // Show success state
      setIsSuccess(true);
      
      // Wait a bit and redirect back to menu
      setTimeout(() => {
        navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!tableId || !restaurantId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Missing table or restaurant information. 
              Please scan the QR code again.
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/customer-menu')}
            >
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (orderItems.length === 0 && !isSuccess) {
    return (
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={0}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Add some delicious items from the menu to place an order.
          </p>
          <Button onClick={() => navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </CustomerMenuLayout>
    );
  }
  
  if (isSuccess) {
    return (
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={0}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted-foreground text-center mb-6">
            Your order has been received and is being prepared.
          </p>
          <p className="font-medium mb-6">Thank you, {name}!</p>
          <Button onClick={() => navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </CustomerMenuLayout>
    );
  }
  
  return (
    <CustomerMenuLayout 
      tableId={tableId} 
      restaurantId={restaurantId}
      orderItemsCount={orderItems.reduce((total, item) => total + item.quantity, 0)}
    >
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Order Summary</h2>
          <Card>
            <CardContent className="pt-6">
              {orderItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">×{quantity}</span>
                  </div>
                  <span>${(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between mt-4 pt-2 border-t font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Your Information</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes for your order?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Payment</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center p-2 border rounded-md bg-muted/50">
                <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Pay at the restaurant</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button
          className="w-full mb-12"
          size="lg"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </CustomerMenuLayout>
  );
};

export default CheckoutPage;
