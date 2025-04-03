
import { useState, useEffect } from 'react';
import { StaffPayrollSummary, StaffPayrollRecord } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';
import { generateStaffPayroll } from '@/utils/demo-data/staff-payroll';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, addDays } from 'date-fns';

export const usePayrollData = (staffId: string) => {
  const [payrollData, setPayrollData] = useState<StaffPayrollRecord[]>([]);
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
        // Try to get data from Supabase first
        const { data, error } = await supabase
          .from('staff_payroll')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching payroll data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Use actual data from Supabase
          console.log(`Loaded ${data.length} payroll records for staff ${staffId}`);
          // Transform data to match our expected format
          const records: StaffPayrollRecord[] = data.map(record => ({
            id: record.id,
            period: record.period,
            base_salary: record.base_salary,
            bonus: record.bonus,
            deductions: record.deductions,
            net_salary: record.net_salary,
            payment_date: record.payment_date,
            status: record.status
          }));
          
          // Calculate summary
          const summary = calculatePayrollSummary(records);
          
          setPayrollData(records);
          setPayrollSummary(summary);
        } else {
          // Generate demo data if no data found
          console.log(`No payroll data found for staff ${staffId}, generating demo data`);
          const demoSummary = generateStaffPayroll(staffId);
          const demoRecords = generateDemoPayrollRecords(staffId, 6);
          
          setPayrollData(demoRecords);
          setPayrollSummary(demoSummary);
        }
      } catch (error) {
        console.error('Falling back to demo data due to error:', error);
        // Generate demo data on error
        const demoSummary = generateStaffPayroll(staffId);
        const demoRecords = generateDemoPayrollRecords(staffId, 6);
        
        setPayrollData(demoRecords);
        setPayrollSummary(demoSummary);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayroll();
  }, [staffId]);
  
  // Helper function to calculate payroll summary
  const calculatePayrollSummary = (records: StaffPayrollRecord[]): StaffPayrollSummary => {
    const totalPaid = records
      .filter(record => record.status === 'paid')
      .reduce((sum, record) => sum + record.net_salary, 0);
    
    const pendingAmount = records
      .filter(record => record.status === 'pending')
      .reduce((sum, record) => sum + record.net_salary, 0);
    
    // Find the most recent payment date
    const paidRecords = records.filter(record => record.status === 'paid');
    const lastPaymentDate = paidRecords.length > 0 
      ? paidRecords.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0].payment_date
      : null;
    
    return {
      totalPaid,
      pendingAmount,
      lastPaymentDate
    };
  };
  
  // Helper function to generate demo payroll records
  const generateDemoPayrollRecords = (staffId: string, months: number): StaffPayrollRecord[] => {
    const records: StaffPayrollRecord[] = [];
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
      const monthDate = subMonths(now, i);
      const periodName = format(monthDate, 'MMMM yyyy');
      
      // Generate payment date (15th of the month)
      const paymentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 15);
      if (paymentDate > now) {
        paymentDate.setMonth(paymentDate.getMonth() - 1); // Use previous month if it's in the future
      }
      
      // Base salary between $2000-$4000
      const baseSalary = Math.floor(Math.random() * 2000) + 2000;
      
      // Bonus between $0-$500
      const bonus = Math.floor(Math.random() * 500);
      
      // Deductions between $200-$500
      const deductions = Math.floor(Math.random() * 300) + 200;
      
      // Net salary
      const netSalary = baseSalary + bonus - deductions;
      
      // Status - most recent month might be pending
      const status: 'paid' | 'pending' = (i === 0) ? 'pending' : 'paid';
      
      records.push({
        id: uuidv4(),
        period: periodName,
        base_salary: baseSalary,
        bonus: bonus,
        deductions: deductions,
        net_salary: netSalary,
        payment_date: format(paymentDate, 'yyyy-MM-dd'),
        status: status
      });
    }
    
    return records;
  };
  
  return {
    payrollData,
    payrollSummary,
    isLoading
  };
};
