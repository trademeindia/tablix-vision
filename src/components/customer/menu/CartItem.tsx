
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { formatCurrency } from '@/services/order/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-[140px] md:max-w-[200px]">{item.name}</span>
        <span className="text-sm text-muted-foreground">{formatCurrency(item.price)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className={`${isMobile ? 'h-8 w-8' : 'h-7 w-7'} rounded-full`}
          onClick={onDecrease}
          aria-label="Decrease quantity"
        >
          <Minus className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
        </Button>
        
        <span className={`${isMobile ? 'w-8' : 'w-6'} text-center`}>{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`${isMobile ? 'h-8 w-8' : 'h-7 w-7'} rounded-full`}
          onClick={onIncrease}
          aria-label="Increase quantity"
        >
          <Plus className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
