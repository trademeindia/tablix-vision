
import { useState, useEffect } from 'react';
import { StaffPayrollSummary } from '@/types/staff';
import { generateStaffPayroll } from '@/utils/demo-data/staff-payroll';

export const usePayrollData = (staffCount: number = 10) => {
  const [payrollData, setPayrollData] = useState<StaffPayrollSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use the demo data generator
    const fetchData = () => {
      setIsLoading(true);
      try {
        const data = generateStaffPayroll(staffCount);
        setPayrollData(data);
      } catch (error) {
        console.error('Error generating payroll data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [staffCount]);
  
  return {
    payrollData,
    isLoading
  };
};
