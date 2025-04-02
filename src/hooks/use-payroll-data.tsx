
import { useState, useEffect } from 'react';
import { StaffPayrollSummary } from '@/types/staff';
import { generateStaffPayroll } from '@/utils/demo-data/staff-data';

export const usePayrollData = (staffId: string) => {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<StaffPayrollSummary>({
    totalPaid: 0,
    pendingAmount: 0,
    lastPaymentDate: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Generate demo payroll data
        const data = generateStaffPayroll(staffId, 6);
        setPayrollData(data);
        
        // Calculate summary
        const totalPaid = data
          .filter(record => record.status === 'paid')
          .reduce((sum, record) => sum + record.net_salary, 0);
        
        const pendingAmount = data
          .filter(record => record.status === 'pending')
          .reduce((sum, record) => sum + record.net_salary, 0);
        
        const paidRecords = data.filter(record => record.status === 'paid');
        const lastPaymentDate = paidRecords.length > 0 ? paidRecords[0].payment_date : null;
        
        setPayrollSummary({
          totalPaid,
          pendingAmount,
          lastPaymentDate
        });
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchPayroll();
    }
  }, [staffId]);

  return {
    payrollData,
    payrollSummary,
    isLoading
  };
};
