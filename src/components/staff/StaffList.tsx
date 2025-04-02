
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, HelpCircle, UserCog, User, Pencil, Trash2, Calendar, DollarSign, Clock
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditStaffDialog from './EditStaffDialog';
import DeleteStaffDialog from './DeleteStaffDialog';
import StaffDetailsDialog from './StaffDetailsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  const handleStatusChange = async (staff: StaffMember, checked: boolean) => {
    try {
      const status = checked ? 'active' : 'inactive';
      const { error } = await supabase
        .from('staff' as any)
        .update({ status })
        .eq('id', staff.id);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `${staff.name} is now ${status}`,
      });
      
      onStaffUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff status',
        variant: 'destructive',
      });
    }
  };

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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'chef':
        return <ChefHat className="h-4 w-4 mr-1 text-amber-500" />;
      case 'manager':
        return <UserCog className="h-4 w-4 mr-1 text-blue-500" />;
      case 'waiter':
        return <User className="h-4 w-4 mr-1 text-green-500" />;
      default:
        return <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />;
    }
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
      <div className="mb-4">
        <Input
          placeholder="Search staff by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
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
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getRoleIcon(staff.role)}
                      {staff.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={staff.status === 'active'} 
                        onCheckedChange={(checked) => handleStatusChange(staff, checked)}
                      />
                      <Badge 
                        variant={staff.status === 'active' ? "default" : "secondary"}
                        className={staff.status === 'active' ? "bg-green-500" : "bg-slate-400"}
                      >
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(staff.last_login)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(staff)}
                        title="View Details"
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(staff)}
                        title="Edit Staff"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(staff)}
                        title="Delete Staff"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
