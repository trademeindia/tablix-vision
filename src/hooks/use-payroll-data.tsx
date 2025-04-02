
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PayrollRecord } from '@/types/payroll';

export const usePayrollData = (staffId?: string) => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      try {
        // This would normally fetch data from Supabase
        // Since 'staff_payroll' table doesn't exist yet, we'll use sample data
        const sampleData = getSamplePayrollData(staffId);
        setPayrollData(sampleData);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payroll data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayrollData();
  }, [staffId, toast]);

  return { 
    payrollData, 
    isLoading 
  };
};

// Sample data for testing
const getSamplePayrollData = (staffId?: string): PayrollRecord[] => {
  const records: PayrollRecord[] = [];
  const today = new Date();
  
  // Create 12 months of payroll history
  for (let i = 0; i < 12; i++) {
    const periodEnd = new Date(today.getFullYear(), today.getMonth() - i, 0);
    const periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
    
    // Randomly determine payment status
    const statusOptions: ('draft' | 'pending' | 'approved' | 'paid')[] = ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'approved', 'draft'];
    const status = i === 0 ? 'pending' : (i === 1 ? 'approved' : 'paid');
    
    // Create payment date (if paid)
    let paymentDate = null;
    if (status === 'paid') {
      paymentDate = new Date(periodEnd);
      paymentDate.setDate(periodEnd.getDate() + 5);
    }
    
    // Generate random salary values
    const baseSalary = 3000 + Math.floor(Math.random() * 500);
    const overtimeHours = Math.floor(Math.random() * 20);
    const overtimeRate = 15;
    const deductions = Math.floor(Math.random() * 200) + 100;
    const bonuses = Math.floor(Math.random() * 300);
    const totalAmount = baseSalary + (overtimeHours * overtimeRate) - deductions + bonuses;
    
    records.push({
      id: `pay-${staffId || 'sample'}-${i}`,
      staff_id: staffId || 'sample',
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      base_salary: baseSalary,
      overtime_hours: overtimeHours,
      overtime_rate: overtimeRate,
      deductions,
      bonuses,
      total_amount: totalAmount,
      status,
      payment_date: paymentDate ? paymentDate.toISOString() : null,
      notes: null,
      created_at: new Date(periodEnd.getFullYear(), periodEnd.getMonth(), periodEnd.getDate() - 5).toISOString()
    });
  }
  
  return records;
};
