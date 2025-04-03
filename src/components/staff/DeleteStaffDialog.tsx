
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeleteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  onStaffDeleted: () => void;
}

const DeleteStaffDialog: React.FC<DeleteStaffDialogProps> = ({
  open,
  onOpenChange,
  staff,
  onStaffDeleted
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log('Deleting staff with ID:', staff.id);
      
      // If using demo data (IDs starting with 'staff-'), simulate deletion
      if (staff.id.startsWith('staff-')) {
        // Wait a moment to simulate server processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: 'Staff Deleted (Demo)',
          description: `${staff.name} has been removed from your staff (Note: This is demo data).`,
        });
        
        onOpenChange(false);
        onStaffDeleted();
        setIsDeleting(false);
        return;
      }
      
      // For real data, delete from Supabase
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', staff.id);
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Staff deleted successfully');
      
      toast({
        title: 'Staff Deleted',
        description: `${staff.name} has been removed from your staff.`,
      });
      
      onOpenChange(false);
      onStaffDeleted();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete staff member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {staff.name} from your staff list.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStaffDialog;
