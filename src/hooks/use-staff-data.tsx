
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/staff';

export const useStaffData = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      let restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Default fallback
      
      // If user is authenticated, get their restaurant ID
      if (sessionData && sessionData.session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (profile?.restaurant_id) {
          restaurantId = profile.restaurant_id;
        }
      }
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('restaurant_id', restaurantId);
      
      if (error) {
        throw error;
      }
      
      setStaffData(data as StaffMember[] || []);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load staff data',
        variant: 'destructive',
      });
      
      // Set sample data for testing if loading fails
      setStaffData(getSampleStaffData());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
    
    // Set up realtime subscription for staff table updates
    const staffSubscription = supabase
      .channel('staff_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff' }, 
        (payload) => {
          console.log('Staff change detected:', payload);
          fetchStaffData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(staffSubscription);
    };
  }, [toast]);

  return { 
    staffData, 
    isLoading,
    refetchStaff: fetchStaffData
  };
};

// Sample data for testing
const getSampleStaffData = (): StaffMember[] => [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john@example.com',
    role: 'Manager',
    status: 'active',
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maria Garcia',
    phone: '+1987654321',
    email: 'maria@example.com',
    role: 'Chef',
    status: 'active',
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Alex Wong',
    phone: '+1567890123',
    email: 'alex@example.com',
    role: 'Waiter',
    status: 'active',
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    phone: '+1678901234',
    email: 'sarah@example.com',
    role: 'Waiter',
    status: 'inactive',
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'David Lee',
    phone: '+1789012345',
    email: 'david@example.com',
    role: 'Receptionist',
    status: 'active',
    restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];
