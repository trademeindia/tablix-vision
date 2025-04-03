
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StaffFormData, StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useStaffStorage } from './use-staff-storage';

interface UseStaffEditProps {
  staff: StaffMember;
  onSuccess: () => void;
  onClose: () => void;
}

export const useStaffEdit = ({ staff, onSuccess, onClose }: UseStaffEditProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { uploadProfileImage } = useStaffStorage();

  const handleSubmit = async (data: StaffFormData) => {
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
      
      // Remove profile_image from data before DB update
      const { profile_image, ...validStaffData } = data;
      
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
      
      onClose();
      onSuccess();
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

  return {
    handleSubmit,
    isSubmitting
  };
};
