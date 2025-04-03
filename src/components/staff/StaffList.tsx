
import React from 'react';
import { StaffMember } from '@/types/staff';
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
