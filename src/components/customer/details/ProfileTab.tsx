
import React from 'react';
import { Customer } from '@/types/customer';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Calendar, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileTabProps {
  customer: Customer;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ customer }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="py-4">
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
    </div>
  );
};

export default ProfileTab;
