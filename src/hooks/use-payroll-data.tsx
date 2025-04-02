
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PayrollRecord } from '@/types/payroll';

export const usePayrollData = (staffId?: string) => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayrollData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_payroll')
        .select('*')
        .order('period_end', { ascending: false });
      
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Type assertion with unknown as an intermediate step
      setPayrollData((data as unknown as PayrollRecord[]) || []);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payroll data',
        variant: 'destructive',
      });
      
      // Sample data for testing
      setPayrollData(getSamplePayrollData(staffId));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
    
    // Set up realtime subscription for payroll table updates
    const payrollSubscription = supabase
      .channel('payroll_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff_payroll' }, 
        (payload) => {
          console.log('Payroll change detected:', payload);
          fetchPayrollData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(payrollSubscription);
    };
  }, [staffId, toast]);

  return { 
    payrollData, 
    isLoading,
    refetchPayroll: fetchPayrollData
  };
};

// Sample data for testing
const getSamplePayrollData = (staffId?: string): PayrollRecord[] => {
  const currentDate = new Date();
  const previousMonth = new Date(currentDate);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  const baseData = [
    {
      id: '1',
      staff_id: '1',
      period_start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString(),
      period_end: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).toISOString(),
      base_salary: 5000,
      overtime_hours: 10,
      overtime_rate: 20,
      deductions: 500,
      bonuses: 200,
      total_amount: 4900,
      status: 'paid',
      payment_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString(),
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      staff_id: '2',
      period_start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString(),
      period_end: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).toISOString(),
      base_salary: 4500,
      overtime_hours: 5,
      overtime_rate: 18,
      deductions: 450,
      bonuses: 0,
      total_amount: 4140,
      status: 'paid',
      payment_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString(),
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      staff_id: '3',
      period_start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString(),
      period_end: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).toISOString(),
      base_salary: 3800,
      overtime_hours: 12,
      overtime_rate: 15,
      deductions: 380,
      bonuses: 150,
      total_amount: 3750,
      status: 'paid',
      payment_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString(),
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      staff_id: '4',
      period_start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
      period_end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
      base_salary: 3500,
      overtime_hours: 0,
      overtime_rate: 14,
      deductions: 350,
      bonuses: 0,
      total_amount: 3150,
      status: 'pending',
      payment_date: null,
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      staff_id: '5',
      period_start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
      period_end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
      base_salary: 4200,
      overtime_hours: 8,
      overtime_rate: 17,
      deductions: 420,
      bonuses: 100,
      total_amount: 4016,
      status: 'pending',
      payment_date: null,
      notes: null,
      created_at: new Date().toISOString()
    }
  ] as PayrollRecord[];
  
  if (staffId) {
    return baseData.filter(record => record.staff_id === staffId);
  }
  
  return baseData;
};
