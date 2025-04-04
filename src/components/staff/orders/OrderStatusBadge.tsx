
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, ChefHat, Check } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    
    case 'preparing':
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1">
          <ChefHat className="h-3 w-3" />
          Preparing
        </Badge>
      );
    
    case 'ready':
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-1">
          <Check className="h-3 w-3" />
          Ready
        </Badge>
      );
    
    case 'served':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1">
          <CheckCircle className="h-3 w-3" />
          Served
        </Badge>
      );
    
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    
    case 'cancelled':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
          <AlertCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    
    default:
      return (
        <Badge>
          {status}
        </Badge>
      );
  }
};

export default OrderStatusBadge;
