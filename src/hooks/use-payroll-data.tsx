
import { useState, useEffect } from 'react';
import { StaffPayrollSummary, StaffPayrollRecord } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';

export const usePayrollData = (staffId: string) => {
  const [payrollSummary, setPayrollSummary] = useState<StaffPayrollSummary>({
    totalPaid: 0,
    pendingAmount: 0,
    lastPaymentDate: null
  });
  const [payrollData, setPayrollData] = useState<StaffPayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from actual Supabase tables
        // Since the staff_payroll table doesn't exist yet, we'll use demo data
        console.log('Generating demo payroll data for staff ID:', staffId);
        
        // Generate random payroll records for the last 6 months
        const records: StaffPayrollRecord[] = [];
        const today = new Date();
        let totalPaid = 0;
        let pendingAmount = 0;
        let lastPaymentDate = null;
        
        for (let i = 0; i < 6; i++) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          
          const baseSalary = 2500 + Math.floor(Math.random() * 1000);
          const bonus = Math.floor(Math.random() * 500);
          const deductions = Math.floor(Math.random() * 300);
          const netSalary = baseSalary + bonus - deductions;
          
          // For the current month, mark as pending
          const isPending = i === 0;
          const status = isPending ? 'pending' : 'paid';
          
          if (isPending) {
            pendingAmount += netSalary;
          } else {
            totalPaid += netSalary;
            if (lastPaymentDate === null) {
              lastPaymentDate = date.toISOString();
            }
          }
          
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                             'July', 'August', 'September', 'October', 'November', 'December'];
          
          records.push({
            id: uuidv4(),
            period: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
            base_salary: baseSalary,
            bonus,
            deductions,
            net_salary: netSalary,
            payment_date: date.toISOString(),
            status
          });
        }
        
        setPayrollData(records);
        setPayrollSummary({
          totalPaid,
          pendingAmount,
          lastPaymentDate
        });
      } catch (error) {
        console.error('Error generating payroll data:', error);
        // Fallback to empty data
        setPayrollData([]);
        setPayrollSummary({
          totalPaid: 0,
          pendingAmount: 0,
          lastPaymentDate: null
        });
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
    payrollSummary,
    isLoading
  };
};
