
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import CustomerExport from './CustomerExport';
import { Customer } from '@/types/customer';
import AddCustomerDialog from './AddCustomerDialog';

interface CustomerPageHeaderProps {
  customers: Customer[];
  onCustomerAdded: (customer: Customer) => void;
}

const CustomerPageHeader: React.FC<CustomerPageHeaderProps> = ({ 
  customers, 
  onCustomerAdded 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-slate-500">View and manage your restaurant customers</p>
      </div>
      <div className="mt-2 sm:mt-0 flex gap-2">
        <CustomerExport customers={customers} />
        <Button 
          className="flex items-center gap-1"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </Button>
      </div>

      <AddCustomerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onCustomerAdded={onCustomerAdded}
      />
    </div>
  );
};

export default CustomerPageHeader;
