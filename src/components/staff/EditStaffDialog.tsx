
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StaffFormData, StaffMember } from '@/types/staff';
import StaffForm from './StaffForm';
import { supabase } from '@/integrations/supabase/client';

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  onStaffUpdated: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  role: z.enum(['Waiter', 'Chef', 'Manager', 'Receptionist']),
  status: z.enum(['active', 'inactive'])
});

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({ 
  open, 
  onOpenChange, 
  staff, 
  onStaffUpdated 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role as any,
      status: staff.status
    }
  });

  // Reset form when staff changes
  React.useEffect(() => {
    form.reset({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role as any,
      status: staff.status
    });
  }, [staff, form]);

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('staff')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', staff.id);
      
      if (error) throw error;
      
      toast({
        title: 'Staff Updated',
        description: `${data.name}'s information has been updated.`,
      });
      
      onOpenChange(false);
      onStaffUpdated();
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <StaffForm form={form} />
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
