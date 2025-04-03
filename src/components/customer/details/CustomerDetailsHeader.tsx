
import React from 'react';
import { Customer } from '@/types/customer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DialogTitle } from '@/components/ui/dialog';

interface CustomerDetailsHeaderProps {
  customer: Customer;
}

const CustomerDetailsHeader: React.FC<CustomerDetailsHeaderProps> = ({ customer }) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center">
      <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-md">
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
          {getInitials(customer.name)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center sm:text-left">
        <DialogTitle className="text-xl">{customer.name}</DialogTitle>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 mt-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
          }`}>
            {customer.status === 'active' ? 'Active' : 'Inactive'}
          </span>
          {customer.segment && (
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              customer.segment === 'vip' 
                ? 'bg-purple-100 text-purple-800' 
                : customer.segment === 'frequent' 
                  ? 'bg-amber-100 text-amber-800' 
                  : customer.segment === 'regular' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-emerald-100 text-emerald-800'
            }`}>
              {customer.segment === 'vip' 
                ? 'VIP' 
                : customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1)}
            </span>
          )}
          {customer.loyaltyPoints !== undefined && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {customer.loyaltyPoints} Points
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsHeader;
