
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyCartViewProps {
  tableId: string;
  restaurantId: string;
}

const EmptyCartView: React.FC<EmptyCartViewProps> = ({ tableId, restaurantId }) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default EmptyCartView;
