
import { useState, useEffect } from 'react';
import { StaffPayrollSummary } from '@/types/staff';
import { generateStaffPayroll } from '@/utils/demo-data/staff-payroll';
import { supabase } from '@/integrations/supabase/client';

export const usePayrollData = (staffId: string) => {
  const [payrollData, setPayrollData] = useState<StaffPayrollSummary>({
    totalPaid: 0,
    pendingAmount: 0,
    lastPaymentDate: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real payroll data from Supabase
        // This is a placeholder for when you implement real payroll tracking
        const { data, error } = await supabase
          .from('staff_payroll')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching payroll data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Process real data when available
          // This is a placeholder for actual data processing
          console.log('Fetched payroll data:', data);
          
          // For now, we'll use demo data
          const demoPayroll = generateStaffPayroll(staffId);
          setPayrollData(demoPayroll);
        } else {
          // Use demo data if no real data is found
          console.log('No payroll data found, using demo data');
          const demoPayroll = generateStaffPayroll(staffId);
          setPayrollData(demoPayroll);
        }
      } catch (error) {
        console.error('Error in payroll data fetch:', error);
        // Fallback to demo data
        const demoPayroll = generateStaffPayroll(staffId);
        setPayrollData(demoPayroll);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchPayrollData();
    }
  }, [staffId]);

  return {
    payrollData,
    isLoading
  };
};
