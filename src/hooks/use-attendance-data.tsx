
import { useStaffDataFetcher } from './use-staff-data-fetcher';
import { StaffAttendanceStats } from '@/types/staff';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';

export const useAttendanceData = (staffCount: number = 10) => {
  const { data, isLoading, error } = useStaffDataFetcher<StaffAttendanceStats>({
    fetchFunction: generateStaffAttendance,
    staffCount
  });
  
  return {
    attendanceData: data,
    isLoading,
    error
  };
};
