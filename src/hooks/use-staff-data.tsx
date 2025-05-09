
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types/staff';
import { generateDemoStaffData } from '@/utils/demo-data/staff-data';
import { supabase } from '@/integrations/supabase/client';

export const useStaffData = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get session data for restaurant ID
      const { data: sessionData } = await supabase.auth.getSession();
      let restaurantId: string | null = null;
      
      // If user is authenticated, try to get their restaurant ID
      if (sessionData && sessionData.session) {
        const userId = sessionData.session.user.id;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', userId)
          .single();
          
        if (profile?.restaurant_id) {
          restaurantId = profile.restaurant_id;
        }
      }
      
      // First attempt to get data from Supabase
      let query = supabase.from('staff').select('*');
      
      // Apply restaurant filter if we have a restaurant ID
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }
      
      const { data: supabaseData, error: supabaseError } = await query;
      
      if (supabaseError) {
        console.error('Error fetching from Supabase:', supabaseError);
        throw supabaseError;
      }
      
      if (supabaseData && supabaseData.length > 0) {
        // Enhanced normalization and data handling with proper type handling
        const normalizedData = supabaseData.map((staff: any) => {
          // Make sure all image-related fields are properly normalized
          const imageUrl = staff.avatar_url || staff.avatar || staff.image || '';
          
          // Create a properly typed staff member with safe type assertions
          const normalizedStaff: StaffMember = {
            id: staff.id || '',
            restaurant_id: staff.restaurant_id || '',
            user_id: staff.user_id || undefined,
            name: staff.name || '',
            phone: staff.phone || '',
            email: staff.email || '',
            role: staff.role || '',
            status: staff.status === 'active' ? 'active' : 'inactive',
            notification_preference: staff.notification_preference,
            last_login: staff.last_login,
            created_at: staff.created_at,
            updated_at: staff.updated_at,
            
            // Safely handle fields that might not be in all staff records
            salary: typeof staff.salary === 'number' ? staff.salary : 
                   typeof staff.salary === 'string' ? parseFloat(staff.salary) : undefined,
            hire_date: staff.hire_date || undefined,
            department: staff.department || undefined,
            manager_id: staff.manager_id || undefined,
            emergency_contact: staff.emergency_contact || undefined,
            
            // Normalize all image fields to have the same value for maximum compatibility
            avatar_url: imageUrl,
            avatar: imageUrl,
            image: imageUrl
          };
          
          return normalizedStaff;
        });
        
        setStaffData(normalizedData);
      } else {
        // Fallback to demo data if no data found in Supabase
        const demoData = generateDemoStaffData(12);
        setStaffData(demoData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in staff data fetch:', err);
      // Fallback to demo data on error
      const demoData = generateDemoStaffData(12);
      setStaffData(demoData);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchStaff = () => {
    fetchData();
  };

  return {
    staffData,
    isLoading,
    error,
    refetchStaff
  };
};
