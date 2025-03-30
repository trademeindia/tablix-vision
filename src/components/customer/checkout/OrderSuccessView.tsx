
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessViewProps {
  name: string;
  orderId: string | null;
  tableId: string;
  restaurantId: string;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ 
  name, 
  orderId, 
  tableId, 
  restaurantId 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Order Placed Successfully!</h2>
      <p className="text-muted-foreground text-center mb-6">
        Your order has been received and is being prepared.
      </p>
      <p className="font-medium mb-2">Thank you, {name}!</p>
      {orderId && (
        <p className="text-sm text-muted-foreground mb-6">
          Order ID: {orderId}
        </p>
      )}
      <Button onClick={() => navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Menu
      </Button>
    </div>
  );
};

export default OrderSuccessView;
