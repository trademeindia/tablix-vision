
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log(`Deleting staff member with ID: ${staff.id}`);
      
      // First check if this is demo data (starts with 'staff-')
      if (staff.id.startsWith('staff-')) {
        // Simulate deletion for demo data
        console.log('Demo data detected, simulating deletion');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: 'Staff Deleted (Demo)',
          description: `${staff.name} has been deleted (Note: This is demo data)`,
        });
        
        onOpenChange(false);
        onStaffDeleted();
        return;
      }
      
      // Delete the staff member
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', staff.id);
      
      if (error) {
        console.error('Error deleting staff:', error);
        throw error;
      }
      
      toast({
        title: 'Staff Deleted',
        description: `${staff.name} has been deleted from your staff.`,
      });
      
      onOpenChange(false);
      onStaffDeleted();
    } catch (error) {
      console.error('Delete operation failed:', error);
      toast({
        title: 'Delete Failed',
        description: 'Could not delete the staff member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Staff Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {staff.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 p-4 mt-2 bg-amber-50 text-amber-900 rounded-md">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <div>
            <p className="font-medium">Warning</p>
            <p className="text-sm">All associated records for this staff member will also be deleted.</p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffDialog;
