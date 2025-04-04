
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

  // Enhanced function to get the best image URL for each staff member
  const getStaffImageUrl = (staff: StaffMember): string => {
    // Choose the first non-empty value
    return staff.avatar_url || staff.avatar || staff.image || '';
  };

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Last Login</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
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
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => onViewDetails(staff)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm">
                      <AvatarImage 
                        src={getStaffImageUrl(staff)} 
                        alt={staff.name} 
                        className="object-cover"
                        onError={(e) => {
                          console.warn(`Failed to load avatar image for ${staff.name}`);
                          // Hide the image on error so fallback appears
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(staff.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{staff.name}</span>
                      {staff.email && (
                        <p className="text-xs text-slate-500">{staff.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <RoleIcon role={staff.role} />
                    <span className="capitalize">{staff.role}</span>
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
