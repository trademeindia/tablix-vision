
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader';
import CustomerFilter from '@/components/customer/CustomerFilter';
import CustomerDetailsDialog from '@/components/customer/details/CustomerDetailsDialog';
import CustomerStats from '@/components/customer/CustomerStats';
import CustomerTabs from '@/components/customer/CustomerTabs';
import { useCustomerData } from '@/hooks/use-customer-data';

const CustomersPage = () => {
  const {
    allCustomers,
    customers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    activeTab,
    setActiveTab,
    selectedCustomer,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    clearFilters,
    getActiveFiltersCount,
    handleViewDetails
  } = useCustomerData();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <CustomerPageHeader customers={customers} />
        <CustomerStats customers={allCustomers} />
      </div>
      
      <CustomerTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customers={customers}
        onViewDetails={handleViewDetails}
      />
      
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
