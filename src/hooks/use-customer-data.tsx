
import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCustomerData = () => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('all');
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
        const transformedData: Customer[] = data.map((customer) => ({
          id: customer.id,
          name: customer.name || '',
          email: customer.email,
          phone: customer.phone,
          created_at: customer.created_at,
          lastVisit: customer.last_visit || customer.created_at,
          
          // These fields are not in the database, so we set default values
          status: 'active',  // Default status
          visits: 0,         // Default visits
          loyaltyPoints: 0,  // Default loyalty points
          segment: 'new' as Customer['segment'],  // Default segment
          total_spent: customer.total_expenditure || 0,
          avgOrderValue: customer.total_expenditure ? customer.total_expenditure / 1 : 0,
          lifetime_value: customer.total_expenditure || 0,
          recent_orders: 0,
          retention_score: 50
        }));
        
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
    customers: tabFilteredCustomers,
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

// Mock data with rich, realistic information for demonstration
const mockCustomers: Customer[] = [
  { 
    id: '1', 
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
    },
    segment: 'regular',
    avgOrderValue: 70.06,
    lifetime_value: 840.75,
    recent_orders: 3,
    retention_score: 85
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '(555) 987-6543', 
    visits: 8, 
    lastVisit: '2023-09-10', 
    status: 'active', 
    loyaltyPoints: 160,
    total_spent: 560.50,
    created_at: '2023-02-15',
    segment: 'new',
    avgOrderValue: 70.06,
    lifetime_value: 560.50,
    recent_orders: 2,
    retention_score: 70
  },
  { 
    id: '3', 
    name: 'Michael Johnson', 
    email: 'michael@example.com', 
    phone: '(555) 456-7890', 
    visits: 5, 
    lastVisit: '2023-08-22', 
    status: 'inactive', 
    loyaltyPoints: 100,
    total_spent: 325.20,
    created_at: '2023-03-20',
    segment: 'new',
    avgOrderValue: 65.04,
    lifetime_value: 325.20,
    recent_orders: 0,
    retention_score: 40
  },
  { 
    id: '4', 
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
    },
    segment: 'vip',
    avgOrderValue: 81.39,
    lifetime_value: 1220.90,
    recent_orders: 4,
    retention_score: 95
  },
  { 
    id: '5', 
    name: 'David Brown', 
    email: 'david@example.com', 
    phone: '(555) 234-5678', 
    visits: 3, 
    lastVisit: '2023-07-30', 
    status: 'inactive', 
    loyaltyPoints: 60,
    total_spent: 180.45,
    created_at: '2023-05-12',
    segment: 'new',
    avgOrderValue: 60.15,
    lifetime_value: 180.45,
    recent_orders: 0,
    retention_score: 30
  },
  { 
    id: '6', 
    name: 'Emily Wilson', 
    email: 'emily@example.com', 
    phone: '(555) 111-2222', 
    visits: 7, 
    lastVisit: '2023-10-05', 
    status: 'active', 
    loyaltyPoints: 140,
    total_spent: 495.30,
    created_at: '2023-04-18',
    segment: 'frequent',
    avgOrderValue: 70.76,
    lifetime_value: 495.30,
    recent_orders: 2,
    retention_score: 80
  },
  { 
    id: '7', 
    name: 'Robert Garcia', 
    email: 'robert@example.com', 
    phone: '(555) 333-4444', 
    visits: 11, 
    lastVisit: '2023-10-12', 
    status: 'active', 
    loyaltyPoints: 220,
    total_spent: 780.25,
    created_at: '2023-01-30',
    segment: 'frequent',
    avgOrderValue: 70.93,
    lifetime_value: 780.25,
    recent_orders: 3,
    retention_score: 85
  },
  { 
    id: '8', 
    name: 'Olivia Martinez', 
    email: 'olivia@example.com', 
    phone: '(555) 555-6666', 
    visits: 20, 
    lastVisit: '2023-10-18', 
    status: 'active', 
    loyaltyPoints: 400,
    total_spent: 1750.60,
    created_at: '2022-08-15',
    favorite_items: ['Filet Mignon', 'Lobster Bisque', 'Chocolate Mousse'],
    notes: 'Birthday on April 15. Always celebrates anniversary at restaurant.',
    segment: 'vip',
    avgOrderValue: 87.53,
    lifetime_value: 1750.60,
    recent_orders: 5,
    retention_score: 98
  },
  { 
    id: '9', 
    name: 'James Wilson', 
    email: 'james@example.com', 
    phone: '(555) 777-8888', 
    visits: 6, 
    lastVisit: '2023-09-25', 
    status: 'active', 
    loyaltyPoints: 120,
    total_spent: 420.30,
    created_at: '2023-03-10',
    segment: 'regular',
    avgOrderValue: 70.05,
    lifetime_value: 420.30,
    recent_orders: 2,
    retention_score: 75
  },
  { 
    id: '10', 
    name: 'Sophia Lee', 
    email: 'sophia@example.com', 
    phone: '(555) 999-0000', 
    visits: 4, 
    lastVisit: '2023-10-01', 
    status: 'active', 
    loyaltyPoints: 80,
    total_spent: 280.50,
    created_at: '2023-06-20',
    preferences: {
      dietary: ['Vegetarian'],
      seating: 'Quiet Corner',
      communication: 'Email'
    },
    segment: 'new',
    avgOrderValue: 70.13,
    lifetime_value: 280.50,
    recent_orders: 1,
    retention_score: 60
  },
  { 
    id: '11', 
    name: 'William Taylor', 
    email: 'william@example.com', 
    phone: '(555) 123-7890', 
    visits: 9, 
    lastVisit: '2023-10-15', 
    status: 'active', 
    loyaltyPoints: 180,
    total_spent: 630.75,
    created_at: '2023-02-05',
    segment: 'frequent',
    avgOrderValue: 70.08,
    lifetime_value: 630.75,
    recent_orders: 3,
    retention_score: 82
  },
  { 
    id: '12', 
    name: 'Ava Anderson', 
    email: 'ava@example.com', 
    phone: '(555) 456-1230', 
    visits: 2, 
    lastVisit: '2023-08-10', 
    status: 'inactive', 
    loyaltyPoints: 40,
    total_spent: 140.25,
    created_at: '2023-07-15',
    segment: 'new',
    avgOrderValue: 70.13,
    lifetime_value: 140.25,
    recent_orders: 0,
    retention_score: 25
  }
];
