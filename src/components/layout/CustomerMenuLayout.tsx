
import React from 'react';
import { ShoppingCart, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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
  
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background z-50 border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold">Menu</h1>
            <p className="text-xs text-muted-foreground">Table #{tableId}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-4">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 z-40">
        <div className="container flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-xs py-1" onClick={() => navigate(`/menu?table=${tableId}&restaurant=${restaurantId}`)}>
            <span className="text-base mb-1">🍔</span>
            Menu
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center text-xs py-1 relative" onClick={() => navigate('/cart')}>
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
          
          <Button variant="ghost" className="flex flex-col items-center text-xs py-1" onClick={() => navigate('/help')}>
            <span className="text-base mb-1">🔔</span>
            Call Staff
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default CustomerMenuLayout;
