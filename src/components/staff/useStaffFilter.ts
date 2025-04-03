
import { useState, useCallback } from 'react';
import { StaffMember } from '@/types/staff';

export const useStaffFilter = (staffData: StaffMember[], filter: string = 'all') => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStaff = staffData.filter(staff => {
    // Apply status filter
    if (filter === 'active' && staff.status !== 'active') return false;
    if (filter === 'inactive' && staff.status !== 'inactive') return false;
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        staff.name.toLowerCase().includes(search) ||
        staff.email.toLowerCase().includes(search) ||
        staff.role.toLowerCase().includes(search) ||
        staff.phone.includes(search)
      );
    }
    
    return true;
  });
  
  return {
    searchTerm,
    setSearchTerm,
    filteredStaff
  };
};
