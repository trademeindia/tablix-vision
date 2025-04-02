
import React from 'react';
import { Input } from '@/components/ui/input';

interface StaffSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const StaffSearch: React.FC<StaffSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="mb-4">
      <Input
        placeholder="Search staff by name, email, or role..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default StaffSearch;
