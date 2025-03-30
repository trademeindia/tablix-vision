
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const PaymentMethodCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center p-2 border rounded-md bg-muted/50">
          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>Pay at the restaurant</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
