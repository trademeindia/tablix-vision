
import React from 'react';
import { StaffMember } from '@/types/staff';
import EditStaffDialog from './EditStaffDialog';
import DeleteStaffDialog from './DeleteStaffDialog';
import StaffDetailsDialog from './StaffDetailsDialog';

interface StaffListDialogsProps {
  selectedStaff: StaffMember | null;
  showEditDialog: boolean;
  showDeleteDialog: boolean;
  showDetailsDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowDetailsDialog: (show: boolean) => void;
  onStaffUpdated: () => void;
}

const StaffListDialogs: React.FC<StaffListDialogsProps> = ({
  selectedStaff,
  showEditDialog,
  showDeleteDialog,
  showDetailsDialog,
  setShowEditDialog,
  setShowDeleteDialog,
  setShowDetailsDialog,
  onStaffUpdated
}) => {
  if (!selectedStaff) return null;
  
  return (
    <>
      <EditStaffDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        staff={selectedStaff}
        onStaffUpdated={onStaffUpdated}
      />
      
      <DeleteStaffDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        staff={selectedStaff}
        onStaffDeleted={onStaffUpdated}
      />
      
      <StaffDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        staff={selectedStaff}
      />
    </>
  );
};

export default StaffListDialogs;
