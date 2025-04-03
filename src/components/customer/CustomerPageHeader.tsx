
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import CustomerExport from './CustomerExport';
import { Customer } from '@/types/customer';

interface CustomerPageHeaderProps {
  customers: Customer[];
}

const CustomerPageHeader: React.FC<CustomerPageHeaderProps> = ({ customers }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-slate-500">View and manage your restaurant customers</p>
      </div>
      <div className="mt-2 sm:mt-0 flex gap-2">
        <CustomerExport customers={customers} />
        <Button className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomerPageHeader;
