
import { useStaffDataFetcher } from './use-staff-data-fetcher';
import { StaffPayrollSummary } from '@/types/staff';
import { generateStaffPayroll } from '@/utils/demo-data/staff-payroll';

export const usePayrollData = (staffCount: number = 10) => {
  const { data, isLoading, error } = useStaffDataFetcher<StaffPayrollSummary>({
    fetchFunction: generateStaffPayroll,
    staffCount
  });
  
  return {
    payrollData: data,
    isLoading,
    error
  };
};
