
import React from 'react';
import { StaffMember } from '@/types/staff'; 
import { Skeleton } from '@/components/ui/skeleton';
import StaffListContainer from './StaffListContainer';

interface StaffListProps {
  staffData: StaffMember[];
  isLoading: boolean;
  filter?: string;
  onStaffUpdated: () => void;
}

const StaffList: React.FC<StaffListProps> = ({ 
  staffData, 
  isLoading, 
  filter = 'all',
  onStaffUpdated
}) => {
  // Return loading skeletons if data is still loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  // Filter data based on the selected filter
  const filteredStaff = staffData.filter(staff => {
    if (filter === 'all') return true;
    if (filter === 'active') return staff.status === 'active';
    if (filter === 'inactive') return staff.status === 'inactive';
    return true;
  });

  return (
    <StaffListContainer 
      staffData={staffData}
      isLoading={isLoading}
      filter={filter}
      onStaffUpdated={onStaffUpdated}
    />
  );
};

export default StaffList;
