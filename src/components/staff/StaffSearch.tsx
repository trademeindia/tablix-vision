
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StaffSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const StaffSearch: React.FC<StaffSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search staff by name, email, role..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
};

export default StaffSearch;
