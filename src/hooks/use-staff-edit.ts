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
      console.log('Form data for edit:', data);
      console.log('Original staff data:', staff);
      
      // Get current session for restaurant_id verification
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      // Keep existing restaurant_id from staff record
      const restaurantId = staff.restaurant_id;
      
      // Handle profile image upload if a new one was selected
      let avatarUrl = staff.avatar_url;
      if (data.profile_image) {
        console.log('Uploading new profile image...');
        avatarUrl = await uploadProfileImage(data.profile_image);
        
        if (avatarUrl) {
          console.log('New profile image uploaded successfully:', avatarUrl);
        } else {
          console.warn('Failed to upload new profile image, keeping existing one');
        }
      }
      
      // Prepare data for update - exclude profile_image as it's not a DB field
      const { profile_image, ...restData } = data;
      
      // Ensure salary is properly typed for database
      const staffUpdateData = {
        ...restData,
        salary: data.salary ? Number(data.salary) : null,
        emergency_contact: data.emergency_contact || null,
        hire_date: data.hire_date || null,
        updated_at: new Date().toISOString()
      };
      
      console.log('Updating staff member with data:', {
        ...staffUpdateData,
        avatar_url: avatarUrl,
        avatar: avatarUrl,
        image: avatarUrl
      });
      
      // Update the staff record
      const { data: updatedData, error } = await supabase
        .from('staff')
        .update({
          ...staffUpdateData,
          avatar_url: avatarUrl,
          avatar: avatarUrl,
          image: avatarUrl
        })
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
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
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
