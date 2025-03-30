
import React from 'react';
import { ShoppingCart, ArrowLeft, User, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerMenuLayoutProps {
  children: React.ReactNode;
  tableId: string;
  restaurantId: string;
  orderItemsCount: number;
}

const CustomerMenuLayout: React.FC<CustomerMenuLayoutProps> = ({ 
  children, 
  tableId, 
  restaurantId,
  orderItemsCount
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determine active tab
  const isMenuActive = location.pathname.includes('customer-menu');
  const isProfileActive = location.pathname.includes('profile');
  const isCallWaiterActive = location.pathname.includes('call-waiter');
  const isOrderActive = location.pathname.includes('checkout');
  
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header - Made more compact for mobile */}
      <header className="sticky top-0 bg-background z-50 border-b border-border">
        <div className="container py-2 flex items-center justify-between">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold">Menu</h1>
            <p className="text-xs text-muted-foreground">Table #{tableId}</p>
          </div>
          
          <Button 
            variant={isProfileActive ? "default" : "ghost"} 
            size={isMobile ? "sm" : "icon"} 
            onClick={() => navigate(`/profile?table=${tableId}&restaurant=${restaurantId}`)}
            className={isProfileActive ? "bg-primary text-primary-foreground" : ""}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-4">
        {children}
      </main>
      
      {/* Bottom navigation - Optimized for touch on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 z-40">
        <div className="container flex justify-around">
          <Button 
            variant={isMenuActive ? "default" : "ghost"} 
            className={`flex flex-col items-center text-xs py-1 touch-action-manipulation ${
              isMenuActive ? "bg-primary/10 text-primary" : ""
            }`}
            onClick={() => navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`)}
          >
            <span className="text-base mb-1">🍔</span>
            Menu
          </Button>
          
          <Button 
            variant={isOrderActive ? "default" : "ghost"} 
            className={`flex flex-col items-center text-xs py-1 relative touch-action-manipulation ${
              isOrderActive ? "bg-primary/10 text-primary" : ""
            }`}
            onClick={() => navigate('/checkout')}
          >
            <span className="text-base mb-1">
              <ShoppingCart className="h-5 w-5" />
              {orderItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {orderItemsCount}
                </Badge>
              )}
            </span>
            Order
          </Button>
          
          <Button 
            variant={isCallWaiterActive ? "default" : "ghost"} 
            className={`flex flex-col items-center text-xs py-1 touch-action-manipulation ${
              isCallWaiterActive ? "bg-primary/10 text-primary" : ""
            }`} 
            onClick={() => navigate(`/call-waiter?table=${tableId}&restaurant=${restaurantId}`)}
          >
            <span className="text-base mb-1">
              <BellRing className="h-5 w-5" />
            </span>
            Call Staff
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default CustomerMenuLayout;
