
import { useState } from 'react';
import { Customer } from '@/types/customer';

// Mock data - in a real application, this would be fetched from an API
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
    },
    segment: 'regular',
    avgOrderValue: 70.06,
    lifetime_value: 840.75,
    recent_orders: 3,
    retention_score: 85
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
    created_at: '2023-02-15',
    segment: 'new',
    avgOrderValue: 70.06,
    lifetime_value: 560.50,
    recent_orders: 2,
    retention_score: 70
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
    created_at: '2023-03-20',
    segment: 'new',
    avgOrderValue: 65.04,
    lifetime_value: 325.20,
    recent_orders: 0,
    retention_score: 40
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
    },
    segment: 'vip',
    avgOrderValue: 81.39,
    lifetime_value: 1220.90,
    recent_orders: 4,
    retention_score: 95
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
    created_at: '2023-05-12',
    segment: 'new',
    avgOrderValue: 60.15,
    lifetime_value: 180.45,
    recent_orders: 0,
    retention_score: 30
  },
  { 
    id: 6, 
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
    id: 7, 
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
  }
];

export const useCustomerData = () => {
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
  
  // Filter customers by search query, status, and date
  const filteredCustomers = mockCustomers.filter(customer => {
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

  return {
    allCustomers: mockCustomers,
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
    handleViewDetails
  };
};
