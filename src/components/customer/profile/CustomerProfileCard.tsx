
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerInfoStorage } from '@/hooks/use-checkout-storage';
import { useLoyalty } from '@/hooks/use-loyalty';
import { User, Phone, Mail, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerProfileCard = () => {
  const customerInfo = useCustomerInfoStorage();
  const { points, isLoading } = useLoyalty();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Profile</CardTitle>
        <CardDescription>Your saved information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{customerInfo.name || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{customerInfo.phone || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customerInfo.email || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="font-medium">{points} points</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProfileCard;
