
import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import CartItem from './CartItem';
import { formatCurrency } from '@/utils/format';

interface OrderSummaryProps {
  orderItems: Array<{item: MenuItem, quantity: number}>;
  onRemoveItem: (itemId: string) => void;
  onAddItem: (item: MenuItem) => void; 
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderItems, 
  onRemoveItem, 
  onAddItem,
  onCheckout 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate total price
  const totalPrice = orderItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity, 
    0
  );
  
  // Calculate total items
  const totalItems = orderItems.reduce(
    (total, { quantity }) => total + quantity, 
    0
  );
  
  if (orderItems.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-background border-t border-border rounded-t-xl shadow-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(totalPrice)}</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onCheckout();
            }} 
            className="mr-2"
          >
            Checkout
          </Button>
          {expanded ? 
            <ChevronDown className="h-5 w-5 text-foreground" /> : 
            <ChevronUp className="h-5 w-5 text-foreground" />
          }
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 max-h-[250px] overflow-y-auto bg-background">
          {orderItems.map(({ item, quantity }) => (
            <CartItem 
              key={item.id}
              item={item}
              quantity={quantity}
              onIncrease={() => onAddItem(item)}
              onDecrease={() => onRemoveItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(OrderSummary);
