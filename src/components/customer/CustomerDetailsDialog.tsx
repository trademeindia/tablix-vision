
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Customer } from '@/types/customer';
import { User, Mail, Phone, MapPin, Calendar, Heart, DollarSign } from 'lucide-react';
import OrderHistory from '@/components/customer/OrderHistory';

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

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
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl">{customer.name}</DialogTitle>
              <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                {customer.loyaltyPoints && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {customer.loyaltyPoints} Points
                  </span>
                )}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Profile</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Email</h3>
                      <p className="font-medium">{customer.email || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Phone</h3>
                      <p className="font-medium">{customer.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Address</h3>
                      <p className="font-medium">{customer.address || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Customer Since</h3>
                      <p className="font-medium">{customer.created_at ? formatDate(customer.created_at) : 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Total Visits</h3>
                      <p className="font-medium">{customer.visits || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Total Spent</h3>
                      <p className="font-medium">${customer.total_spent?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {customer.notes && (
                <Card className="p-4 shadow-sm md:col-span-2">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
                  <p className="text-sm">{customer.notes}</p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory orders={mockOrders} isLoading={false} />
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card className="p-4 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Dietary Preferences</h3>
                  <div className="flex flex-wrap gap-1">
                    {customer.preferences?.dietary?.length ? (
                      customer.preferences.dietary.map((pref, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {pref}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No dietary preferences specified</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Seating Preference</h3>
                  <p>{customer.preferences?.seating || 'No preference specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Favorite Items</h3>
                  <div className="flex flex-wrap gap-1">
                    {customer.favorite_items?.length ? (
                      customer.favorite_items.map((item, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <Heart className="h-3 w-3 mr-1" />
                          {item}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No favorite items yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Communication Preference</h3>
                  <p>{customer.preferences?.communication || 'Not specified'}</p>
                </div>
              </div>
            </Card>
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
