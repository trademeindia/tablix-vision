
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateLoyaltyPoints } from '@/services/loyaltyService';

interface OrderSuccessViewProps {
  name: string;
  orderId: string | null;
  tableId: string;
  restaurantId: string;
  totalAmount?: number;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ 
  name, 
  orderId, 
  tableId, 
  restaurantId,
  totalAmount = 0
}) => {
  const navigate = useNavigate();
  const [pointsEarned, setPointsEarned] = useState(0);
  
  useEffect(() => {
    if (totalAmount > 0) {
      const points = calculateLoyaltyPoints(totalAmount);
      setPointsEarned(points);
    }
  }, [totalAmount]);
  
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
        <p className="text-sm text-muted-foreground mb-2">
          Order ID: {orderId}
        </p>
      )}
      
      {pointsEarned > 0 && (
        <div className="flex items-center justify-center bg-primary/10 rounded-full p-2 mb-6">
          <Gift className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm font-medium">
            You earned {pointsEarned} loyalty points!
          </span>
        </div>
      )}
      
      <div className="flex gap-3 mt-4">
        <Button onClick={() => navigate(`/customer-menu?table=${tableId}&restaurant=${restaurantId}`)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate(`/profile?table=${tableId}&restaurant=${restaurantId}`)}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessView;
