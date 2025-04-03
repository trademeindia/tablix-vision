
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
      // First attempt to get data from Supabase
      console.log('Fetching staff data from Supabase...');
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('staff')
        .select('*');
      
      if (supabaseError) {
        console.error('Error fetching from Supabase:', supabaseError);
        throw supabaseError;
      }
      
      if (supabaseData && supabaseData.length > 0) {
        console.log('Successfully fetched staff data from Supabase:', supabaseData.length, 'records');
        
        // Normalize status to ensure it's either 'active' or 'inactive'
        const normalizedData = supabaseData.map(staff => ({
          ...staff,
          // Ensure status is always 'active' or 'inactive'
          status: staff.status === 'active' ? 'active' : 'inactive'
        })) as StaffMember[];
        
        setStaffData(normalizedData);
      } else {
        // Fallback to demo data if no data found in Supabase
        console.log('No data found in Supabase, using demo data instead');
        const demoData = generateDemoStaffData(12);
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
