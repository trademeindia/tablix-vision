
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StaffStatusBadge from './StaffStatusBadge';
import StaffActions from './StaffActions';
import RoleIcon from './RoleIcon';

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

interface StaffTableProps {
  staffData: StaffMember[];
  onViewDetails: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onStaffUpdated: () => void;
  filteredStaff: StaffMember[];
}

const StaffTable: React.FC<StaffTableProps> = ({ 
  filteredStaff,
  onViewDetails,
  onEdit,
  onDelete,
  onStaffUpdated
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
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
                onClick={() => onViewDetails(staff)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={staff.avatar_url || staff.avatar || staff.image} 
                        alt={staff.name} 
                        onError={(e) => {
                          console.log(`Failed to load image for staff: ${staff.name}`);
                          // Let fallback kick in naturally
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
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
                    onView={onViewDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffTable;
