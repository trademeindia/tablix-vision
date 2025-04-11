
import React, { useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StaffFormData, StaffMember } from '@/types/staff';
import StaffForm from './StaffForm';
import { Form } from '@/components/ui/form';
import { useStaffEdit } from '@/hooks/use-staff-edit';

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
  status: z.enum(['active', 'inactive']),
  salary: z.number().optional(),
  hire_date: z.string().optional(),
  department: z.string().optional(),
  emergency_contact: z.string().optional(),
  profile_image: z.instanceof(File).optional().nullable()
});

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({ 
  open, 
  onOpenChange, 
  staff, 
  onStaffUpdated 
}) => {
  const form = useForm<StaffFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role as any,
      status: staff.status,
      salary: staff.salary,
      emergency_contact: staff.emergency_contact || '',
      profile_image: null
    }
  });

  // Reset form when staff changes
  useEffect(() => {
    form.reset({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role as any,
      status: staff.status,
      salary: staff.salary,
      emergency_contact: staff.emergency_contact || '',
      profile_image: null
    });
  }, [staff, form]);

  const { handleSubmit, isSubmitting } = useStaffEdit({
    staff,
    onSuccess: onStaffUpdated,
    onClose: () => onOpenChange(false)
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit)(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={onFormSubmit} className="space-y-4">
            <StaffForm form={form} existingStaff={staff} />
            
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
