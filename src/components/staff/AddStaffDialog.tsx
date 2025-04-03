
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StaffFormData } from '@/types/staff';
import StaffForm from './StaffForm';
import { supabase } from '@/integrations/supabase/client';
import { Form } from '@/components/ui/form';

interface AddStaffDialogProps {
  onStaffAdded: () => void;
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
  avatar: z.string().url('Please provide a valid URL').optional().or(z.literal(''))
});

const AddStaffDialog: React.FC<AddStaffDialogProps> = ({ onStaffAdded }) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Waiter',
      status: 'active',
      salary: undefined,
      emergency_contact: '',
      avatar: ''
    }
  });

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
      }
      
      let restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Default fallback
      
      // If user is authenticated, get their restaurant ID
      if (sessionData && sessionData.session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (profile?.restaurant_id) {
          restaurantId = profile.restaurant_id;
        }
      }
      
      console.log('Adding staff member with data:', {
        ...data,
        restaurant_id: restaurantId
      });
      
      const { data: insertedData, error } = await supabase
        .from('staff')
        .insert([{
          ...data,
          restaurant_id: restaurantId,
          user_id: null, // In a real app, we might create an auth user and link them
          created_at: new Date().toISOString(),
          image: data.avatar // Store avatar URL in both avatar and image fields
        }])
        .select();
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Staff added successfully:', insertedData);
      
      toast({
        title: 'Staff Added',
        description: `${data.name} has been added to your staff.`,
      });
      
      form.reset();
      setOpen(false);
      onStaffAdded();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to add staff member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffForm form={form} />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Staff'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
