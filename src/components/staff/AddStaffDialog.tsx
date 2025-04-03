
import React, { useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

interface AddStaffDialogProps {
  onStaffAdded: () => void;
}

// Update the form schema to accept File for profile_image
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

const AddStaffDialog: React.FC<AddStaffDialogProps> = ({ onStaffAdded }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      profile_image: null
    }
  });

  // Check if bucket exists and create it if it doesn't
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // First check if the bucket already exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`Bucket ${bucketName} already exists`);
        return true;
      }
      
      // Create the bucket if it doesn't exist
      console.log(`Creating bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      // Create public access policy for the bucket using the edge function
      try {
        // Instead of using RPC, we'll call our edge function directly
        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/create-storage-policy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({ bucket_name: bucketName })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error creating bucket policy via edge function:', errorData);
        } else {
          console.log('Successfully created bucket policy via edge function');
        }
      } catch (policyErr) {
        // If the edge function call fails, log it but continue
        console.warn('Could not create bucket policy via edge function, continuing anyway:', policyErr);
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in ensureBucketExists:', error);
      return false;
    }
  };

  // Upload an image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    const bucketName = 'staff-profiles';
    try {
      // Ensure the bucket exists
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        console.error('Failed to ensure bucket exists');
        throw new Error('Failed to prepare storage bucket for upload');
      }

      // Generate a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to bucket ${bucketName}`);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Form data submitted:', data);
      
      // Get session data for restaurant ID
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      let restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Default fallback
      let userId = null;
      
      // If user is authenticated, get their restaurant ID
      if (sessionData && sessionData.session) {
        userId = sessionData.session.user.id;
        console.log('Authenticated user ID:', userId);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          // Continue with default restaurant ID
        } else if (profile?.restaurant_id) {
          restaurantId = profile.restaurant_id;
          console.log('Using restaurant ID from profile:', restaurantId);
        } else {
          console.log('No restaurant ID found in profile, using default');
        }
      } else {
        console.log('No active session found, using default restaurant ID');
      }

      // Handle profile image upload if it exists
      let avatarUrl = null;
      if (data.profile_image) {
        console.log('Uploading profile image...');
        avatarUrl = await uploadProfileImage(data.profile_image);
        
        if (avatarUrl) {
          console.log('Profile image uploaded successfully:', avatarUrl);
        } else {
          console.warn('Failed to upload profile image, continuing without image');
        }
      }
      
      // Prepare data for insertion - exclude profile_image as it's not a DB field
      const { profile_image, ...staffData } = data;
      
      console.log('Adding staff member with data:', {
        ...staffData,
        restaurant_id: restaurantId,
        user_id: userId,
        avatar_url: avatarUrl
      });
      
      // Insert the new staff record
      const { data: insertedData, error } = await supabase
        .from('staff')
        .insert([{
          ...staffData,
          restaurant_id: restaurantId,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: avatarUrl, // Use the uploaded image URL
          avatar: avatarUrl, // For backward compatibility
          image: avatarUrl, // For further compatibility
        }])
        .select();
      
      if (error) {
        console.error('Supabase insert error details:', error);
        throw new Error('Database error: ' + error.message);
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
        description: error instanceof Error ? error.message : 'Failed to add staff member. Please try again.',
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
