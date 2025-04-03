
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from '@/types/customer';
import CustomerDetailsHeader from './CustomerDetailsHeader';
import ProfileTab from './ProfileTab';
import OrderHistory from '@/components/customer/OrderHistory';
import PreferencesTab from './PreferencesTab';
import AnalyticsTab from './AnalyticsTab';

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
}

const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  open,
  onOpenChange,
  customer,
}) => {
  // Mock orders for demo purposes - in a real app, fetch from API
  const mockOrders = [
    {
      id: "order-1",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      total_amount: 42.50,
      items: [{ name: "Pasta Carbonara", quantity: 1 }, { name: "Tiramisu", quantity: 1 }]
    },
    {
      id: "order-2",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      total_amount: 78.25,
      items: [{ name: "Grilled Salmon", quantity: 2 }, { name: "Caesar Salad", quantity: 1 }]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <CustomerDetailsHeader customer={customer} />
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Profile</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ProfileTab customer={customer} />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory orders={mockOrders} isLoading={false} />
          </TabsContent>
          
          <TabsContent value="preferences">
            <PreferencesTab customer={customer} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsTab customer={customer} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
