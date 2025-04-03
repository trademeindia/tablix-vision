
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
      console.log('Fetching staff data from Supabase...');
      
      // Get session data for restaurant ID
      const { data: sessionData } = await supabase.auth.getSession();
      let restaurantId: string | null = null;
      
      // If user is authenticated, try to get their restaurant ID
      if (sessionData && sessionData.session) {
        const userId = sessionData.session.user.id;
        console.log('Authenticated user ID:', userId);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', userId)
          .single();
          
        if (profile?.restaurant_id) {
          restaurantId = profile.restaurant_id;
          console.log('Using restaurant ID from profile:', restaurantId);
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
        console.log('Successfully fetched staff data from Supabase:', supabaseData.length, 'records');
        console.log('Sample staff data:', supabaseData[0]);
        
        // Enhanced normalization and data handling
        const normalizedData = supabaseData.map(staff => {
          // Log all image related fields for debugging
          console.log(`Image fields for staff ${staff.name}:`, {
            avatar_url: staff.avatar_url, 
            avatar: staff.avatar, 
            image: staff.image
          });
          
          // Ensure all image fields have consistent values
          const imageUrl = staff.avatar_url || staff.avatar || staff.image;
          
          return {
            ...staff,
            // Ensure status is always 'active' or 'inactive'
            status: staff.status === 'active' ? 'active' : 'inactive',
            // Normalize all image fields to have the same value for maximum compatibility
            avatar_url: imageUrl,
            avatar: imageUrl,
            image: imageUrl
          };
        }) as StaffMember[];
        
        setStaffData(normalizedData);
      } else {
        // Fallback to demo data if no data found in Supabase
        console.log('No data found in Supabase, using demo data instead');
        const demoData = generateDemoStaffData(12);
        // Add logging for demo data
        console.log('Generated demo data with avatars:', 
          demoData.map(staff => ({ name: staff.name, avatar: staff.avatar_url }))
        );
        setStaffData(demoData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in staff data fetch:', err);
      // Fallback to demo data on error
      console.log('Error occurred, falling back to demo data');
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
