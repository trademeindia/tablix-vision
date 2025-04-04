
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/profile/ProfileForm';
import AccountSettingsForm from '@/components/profile/AccountSettingsForm';
import { useCustomerInfoStorage } from '@/hooks/use-checkout-storage';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';
import { useAuth } from '@/contexts/AuthContext';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table') || localStorage.getItem('tableId') || '';
  const restaurantId = searchParams.get('restaurant') || localStorage.getItem('restaurantId') || '';
  const { user } = useAuth();
  const { customerInfo } = useCustomerInfoStorage();
  
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
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="settings">
              <AccountSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </CustomerMenuLayout>
    </PageTransition>
  );
};

export default UserProfilePage;
