
import { useState, useMemo } from 'react';
import { StaffMember } from '@/types/staff';

interface UseStaffFilterResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredStaff: StaffMember[];
}

export const useStaffFilter = (staffData: StaffMember[], filter: string): UseStaffFilterResult => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => {
      // Filter by status
      const statusFilter = 
        filter === 'all' ? true : 
        filter === 'active' ? staff.status === 'active' : 
        staff.status === 'inactive';
      
      // Filter by search term (name, email, phone, role)
      const searchFilter = searchTerm === '' || 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff.email && staff.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.phone && staff.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return statusFilter && searchFilter;
    });
  }, [staffData, filter, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredStaff
  };
};
