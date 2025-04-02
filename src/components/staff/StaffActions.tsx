
import React from 'react';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { Pencil, Trash2 } from 'lucide-react';

interface StaffActionsProps {
  staff: StaffMember;
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
}

const StaffActions: React.FC<StaffActionsProps> = ({ 
  staff, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onView(staff)}
        title="View Details"
      >
        View
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onEdit(staff)}
        title="Edit Staff"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onDelete(staff)}
        title="Delete Staff"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StaffActions;
