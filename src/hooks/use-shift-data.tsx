
import { useStaffDataFetcher } from './use-staff-data-fetcher';
import { StaffShiftSummary } from '@/types/shift';
import { generateStaffShifts } from '@/utils/demo-data/staff-shifts';

export const useShiftData = (staffCount: number = 10) => {
  const { data, isLoading, error } = useStaffDataFetcher<StaffShiftSummary>({
    fetchFunction: generateStaffShifts,
    staffCount
  });
  
  return {
    shiftData: data,
    isLoading,
    error
  };
};
