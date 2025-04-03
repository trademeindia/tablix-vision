
import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockCustomers } from '@/data/mock-customers';
import { transformCustomerData } from '@/utils/customer-data-transformer';
import { useCustomerFilters } from '@/hooks/use-customer-filters';

export const useCustomerData = () => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch customers from Supabase
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform data to match Customer type
        const transformedData = transformCustomerData(data);
        
        if (transformedData.length > 0) {
          setAllCustomers(transformedData);
        } else {
          // If no data from Supabase, use mock data
          setAllCustomers(mockCustomers);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customers. Please try again.',
          variant: 'destructive',
        });
        
        // Load mock data as fallback
        setAllCustomers(mockCustomers);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [toast]);

  // Use the customer filters hook
  const {
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
    filteredCustomers: customers
  } = useCustomerFilters(allCustomers);
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    // Add the new customer to the list
    setAllCustomers(prev => [newCustomer, ...prev]);
    
    // Show success toast
    toast({
      title: 'Customer Added',
      description: `${newCustomer.name} has been added successfully.`
    });
  };

  return {
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
    setSelectedCustomer,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    clearFilters,
    getActiveFiltersCount,
    handleViewDetails,
    handleCustomerAdded,
    isLoading
  };
};
