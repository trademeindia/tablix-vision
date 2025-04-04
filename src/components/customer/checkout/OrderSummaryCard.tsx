
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/types/menu';
import { formatCurrency } from '@/utils/format';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface OrderSummaryCardProps {
  orderItems: OrderItem[];
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ orderItems }) => {
  const totalPrice = orderItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity, 
    0
  );
  
  return (
    <Card>
      <CardContent className="pt-6">
        {orderItems.map(({ item, quantity }) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground ml-2">×{quantity}</span>
            </div>
            <span>₹{(item.price * quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
        
        <div className="flex justify-between mt-4 pt-2 border-t font-semibold">
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
