import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditStaffDialog from './EditStaffDialog';
import DeleteStaffDialog from './DeleteStaffDialog';
import StaffDetailsDialog from './StaffDetailsDialog';
import StaffStatusBadge from './StaffStatusBadge';
import StaffActions from './StaffActions';
import StaffSearch from './StaffSearch';
import RoleIcon from './RoleIcon';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredStaff = staffData.filter(staff => {
    if (filter === 'active' && staff.status !== 'active') return false;
    if (filter === 'inactive' && staff.status !== 'inactive') return false;
    
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
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
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow 
                  key={staff.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleViewDetails(staff)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={staff.avatar || staff.image} alt={staff.name} />
                        <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <RoleIcon role={staff.role} />
                      {staff.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StaffStatusBadge 
                      staff={staff} 
                      onStatusChange={onStaffUpdated} 
                    />
                  </TableCell>
                  <TableCell>{formatDate(staff.last_login)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <StaffActions
                      staff={staff}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedStaff && (
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
      )}
    </div>
  );
};

export default StaffList;
