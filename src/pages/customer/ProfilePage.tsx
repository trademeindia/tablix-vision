
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import CustomerProfileCard from '@/components/customer/profile/CustomerProfileCard';
import LoyaltyPointsCard from '@/components/customer/loyalty/LoyaltyPointsCard';
import { useLoyalty } from '@/hooks/use-loyalty';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table') || localStorage.getItem('tableId') || '';
  const restaurantId = searchParams.get('restaurant') || localStorage.getItem('restaurantId') || '';
  
  const { points, customerId, updatePoints, isLoading } = useLoyalty();
  
  const handlePointsRedeemed = (newPoints: number, discountAmount: number) => {
    updatePoints(newPoints);
  };
  
  if (!tableId || !restaurantId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Missing Information</h1>
        <p className="text-center mb-6">
          Table or restaurant information is missing. Please scan the QR code again.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Main Page
        </Button>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={0}
      >
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Your Profile</h1>
          </div>
          
          <div className="space-y-6">
            <CustomerProfileCard />
            <LoyaltyPointsCard 
              points={points} 
              customerId={customerId}
              onPointsRedeemed={handlePointsRedeemed}
            />
          </div>
        </div>
      </CustomerMenuLayout>
    </PageTransition>
  );
};

export default CustomerProfilePage;
