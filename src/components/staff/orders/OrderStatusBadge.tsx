
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'preparing':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Preparing</Badge>;
    case 'ready':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Ready</Badge>;
    case 'served':
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Served</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default OrderStatusBadge;
