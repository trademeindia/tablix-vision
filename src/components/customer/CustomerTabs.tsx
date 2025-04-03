
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerTable from './CustomerTable';
import { Customer } from '@/types/customer';

interface CustomerTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  customers, 
  onViewDetails 
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="m-0">
        <CustomerTable 
          customers={customers}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
      
      <TabsContent value="active" className="m-0">
        <CustomerTable 
          customers={customers}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
      
      <TabsContent value="inactive" className="m-0">
        <CustomerTable 
          customers={customers}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
      
      <TabsContent value="loyalty" className="m-0">
        <CustomerTable 
          customers={customers}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CustomerTabs;
