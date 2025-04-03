
import React, { useState, useEffect } from 'react';
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
import { Form } from '@/components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { useStaffStorage } from '@/hooks/use-staff-storage';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { uploadProfileImage } = useStaffStorage();
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role as any,
      status: staff.status,
      salary: staff.salary,
      emergency_contact: '', // This field isn't in the database
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
      emergency_contact: '', // This field isn't in the database
      profile_image: null
    });
  }, [staff, form]);

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating staff with ID:', staff.id, 'New data:', data);
      
      // Handle profile image upload if it exists
      let avatarUrl = staff.avatar_url || staff.avatar || staff.image;
      if (data.profile_image) {
        console.log('Uploading new profile image...');
        const newAvatarUrl = await uploadProfileImage(data.profile_image);
        
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
          console.log('Profile image uploaded successfully:', avatarUrl);
        } else {
          console.warn('Failed to upload profile image, continuing with existing image');
        }
      }
      
      // Remove profile_image and emergency_contact from data before DB update
      const { profile_image, emergency_contact, ...validStaffData } = data;
      
      const { data: updatedData, error } = await supabase
        .from('staff')
        .update({
          ...validStaffData,
          avatar_url: avatarUrl,
          avatar: avatarUrl, // For backward compatibility
          image: avatarUrl, // For further compatibility
          updated_at: new Date().toISOString()
        })
        .eq('id', staff.id)
        .select();
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Staff updated successfully:', updatedData);
      
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
        description: 'Failed to update staff member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
