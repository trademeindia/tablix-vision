
import React, { useState } from 'react';
import { StaffMember } from '@/types/staff';
import { Skeleton } from '@/components/ui/skeleton';
import StaffSearch from './StaffSearch';
import StaffTable from './StaffTable';
import StaffListDialogs from './StaffListDialogs';
import { useStaffFilter } from './useStaffFilter';

interface StaffListContainerProps {
  staffData: StaffMember[];
  isLoading: boolean;
  filter?: string;
  onStaffUpdated: () => void;
}

const StaffListContainer: React.FC<StaffListContainerProps> = ({
  staffData,
  isLoading,
  filter = 'all',
  onStaffUpdated
}) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { searchTerm, setSearchTerm, filteredStaff } = useStaffFilter(staffData, filter);

  const handleEdit = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowEditDialog(true);
  };

  const handleDelete = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowDeleteDialog(true);
  };

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowDetailsDialog(true);
  };
  
  const handleStaffStatusChange = () => {
    // Call the parent's onStaffUpdated to refresh data
    onStaffUpdated();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div>
      <StaffSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      <StaffTable 
        filteredStaff={filteredStaff}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStaffUpdated={handleStaffStatusChange}
        staffData={staffData}
      />
      
      <StaffListDialogs
        selectedStaff={selectedStaff}
        showEditDialog={showEditDialog}
        showDeleteDialog={showDeleteDialog}
        showDetailsDialog={showDetailsDialog}
        setShowEditDialog={setShowEditDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setShowDetailsDialog={setShowDetailsDialog}
        onStaffUpdated={onStaffUpdated}
      />
    </div>
  );
};

export default StaffListContainer;
