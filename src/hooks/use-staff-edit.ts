
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffFormData, StaffMember } from '@/types/staff';
import { useStaffStorage } from './use-staff-storage';

interface UseStaffEditProps {
  staff: StaffMember;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useStaffEdit = ({ staff, onSuccess, onClose }: UseStaffEditProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { uploadProfileImage } = useStaffStorage();

  const handleSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Form data submitted for update:', data);
      
      // Handle profile image upload if it exists
      let avatarUrl = staff.avatar_url || null;
      if (data.profile_image) {
        console.log('Uploading updated profile image...');
        const newAvatarUrl = await uploadProfileImage(data.profile_image);
        
        if (newAvatarUrl) {
          console.log('Profile image uploaded successfully:', newAvatarUrl);
          avatarUrl = newAvatarUrl;
        } else {
          console.warn('Failed to upload profile image, keeping existing image');
        }
      }
      
      // Prepare data for update - exclude profile_image as it's not a DB field
      const { profile_image, emergency_contact, ...restData } = data;
      
      // Ensure salary is properly typed for the database
      const staffData = {
        ...restData,
        salary: data.salary ? Number(data.salary) : null,
        emergency_contact: emergency_contact || null,
        hire_date: data.hire_date || null,
        updated_at: new Date().toISOString(),
        avatar_url: avatarUrl,
        avatar: avatarUrl, // For backward compatibility
        image: avatarUrl, // For further compatibility
      };
      
      console.log('Updating staff member with data:', staffData);
      
      // Update the staff record
      const { data: updatedData, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', staff.id)
        .select();
      
      if (error) {
        console.error('Supabase update error details:', error);
        throw new Error('Database error: ' + error.message);
      }
      
      console.log('Staff updated successfully:', updatedData);
      
      toast({
        title: 'Staff Updated',
        description: `${data.name}'s information has been updated.`,
      });
      
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update staff member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
