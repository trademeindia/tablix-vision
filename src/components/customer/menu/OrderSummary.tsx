
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface OrderSummaryProps {
  orderItems: Array<{item: MenuItem, quantity: number}>;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderItems, 
  onRemoveItem, 
  onCheckout 
}) => {
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <ShoppingCart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          <p className="text-sm font-bold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>
      
      <Button onClick={onCheckout}>
        View Order
      </Button>
    </div>
  );
};

export default OrderSummary;
