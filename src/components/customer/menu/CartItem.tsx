
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface CartItemProps {
  item: MenuItem;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  quantity, 
  onIncrease, 
  onDecrease 
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground">${item.price.toFixed(2)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 rounded-full" 
          onClick={onDecrease}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-6 text-center">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 rounded-full" 
          onClick={onIncrease}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
