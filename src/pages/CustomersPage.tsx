
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Customer } from '@/types/customer';
import CustomerTable from '@/components/customer/CustomerTable';
import CustomerFilter from '@/components/customer/CustomerFilter';
import CustomerDetailsDialog from '@/components/customer/CustomerDetailsDialog';

// Mock data - in a real app, this would come from your API
const mockCustomers: Customer[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '(555) 123-4567', 
    visits: 12, 
    lastVisit: '2023-09-15', 
    status: 'active', 
    loyaltyPoints: 240,
    total_spent: 840.75,
    created_at: '2023-01-10',
    favorite_items: ['Pasta Carbonara', 'Tiramisu'],
    notes: 'Prefers window seating. Allergic to nuts.',
    address: '123 Main St, Anytown, USA',
    preferences: {
      dietary: ['Gluten-Free'],
      seating: 'Window',
      communication: 'Email'
    }
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '(555) 987-6543', 
    visits: 8, 
    lastVisit: '2023-09-10', 
    status: 'active', 
    loyaltyPoints: 160,
    total_spent: 560.50,
    created_at: '2023-02-15'
  },
  { 
    id: 3, 
    name: 'Michael Johnson', 
    email: 'michael@example.com', 
    phone: '(555) 456-7890', 
    visits: 5, 
    lastVisit: '2023-08-22', 
    status: 'inactive', 
    loyaltyPoints: 100,
    total_spent: 325.20,
    created_at: '2023-03-20'
  },
  { 
    id: 4, 
    name: 'Sarah Williams', 
    email: 'sarah@example.com', 
    phone: '(555) 789-0123', 
    visits: 15, 
    lastVisit: '2023-09-18', 
    status: 'active', 
    loyaltyPoints: 300,
    total_spent: 1220.90,
    created_at: '2022-11-05',
    favorite_items: ['Caesar Salad', 'Grilled Salmon', 'Cheesecake'],
    preferences: {
      dietary: ['Pescatarian'],
      seating: 'Booth',
      communication: 'Phone'
    }
  },
  { 
    id: 5, 
    name: 'David Brown', 
    email: 'david@example.com', 
    phone: '(555) 234-5678', 
    visits: 3, 
    lastVisit: '2023-07-30', 
    status: 'inactive', 
    loyaltyPoints: 60,
    total_spent: 180.45,
    created_at: '2023-05-12'
  },
];

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setDateFilter(null);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter) count++;
    if (dateFilter) count++;
    return count;
  };
  
  // Filter customers based on search, status, and date filters
  const filteredCustomers = mockCustomers.filter(customer => {
    // Search filter
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchQuery));
      
    // Status filter
    const matchesStatus = statusFilter ? customer.status === statusFilter : true;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter && customer.lastVisit) {
      const lastVisitDate = new Date(customer.lastVisit);
      const filterDate = new Date(dateFilter);
      matchesDate = 
        lastVisitDate.getFullYear() === filterDate.getFullYear() &&
        lastVisitDate.getMonth() === filterDate.getMonth() &&
        lastVisitDate.getDate() === filterDate.getDate();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Filter by active tab
  const tabFilteredCustomers = filteredCustomers.filter(customer => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return customer.status === 'active';
    if (activeTab === 'inactive') return customer.status === 'inactive';
    if (activeTab === 'loyalty') return (customer.loyaltyPoints || 0) > 100;
    return true;
  });
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-slate-500">View and manage your restaurant customers</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <Tabs 
          defaultValue="all" 
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
            
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </div>
          
          <CustomerFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            clearFilters={clearFilters}
            activeFiltersCount={getActiveFiltersCount()}
          />
          
          <TabsContent value="all" className="m-0">
            <CustomerTable 
              customers={tabFilteredCustomers}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
          
          <TabsContent value="active" className="m-0">
            <CustomerTable 
              customers={tabFilteredCustomers}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
          
          <TabsContent value="inactive" className="m-0">
            <CustomerTable 
              customers={tabFilteredCustomers}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
          
          <TabsContent value="loyalty" className="m-0">
            <CustomerTable 
              customers={tabFilteredCustomers}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedCustomer && (
        <CustomerDetailsDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          customer={selectedCustomer}
        />
      )}
    </DashboardLayout>
  );
};

export default CustomersPage;
