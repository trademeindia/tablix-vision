
import { useState } from 'react';
import { Customer } from '@/types/customer';

export interface CustomerFilters {
  searchQuery: string;
  statusFilter: string | null;
  dateFilter: Date | null;
  activeTab: string;
}

export const useCustomerFilters = (allCustomers: Customer[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('all');

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
  
  // Filter customers by search query, status, and date
  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchQuery));
      
    const matchesStatus = statusFilter ? customer.status === statusFilter : true;
    
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
  
  // Filter by tab selection
  const tabFilteredCustomers = filteredCustomers.filter(customer => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return customer.status === 'active';
    if (activeTab === 'inactive') return customer.status === 'inactive';
    if (activeTab === 'loyalty') return (customer.loyaltyPoints || 0) > 100;
    return true;
  });

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    activeTab,
    setActiveTab,
    clearFilters,
    getActiveFiltersCount,
    filteredCustomers: tabFilteredCustomers
  };
};
