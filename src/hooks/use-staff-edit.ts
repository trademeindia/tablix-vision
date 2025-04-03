
import { useState } from 'react';
import { StaffFormData, StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useStaffStorage } from '@/hooks/use-staff-storage';

interface UseStaffEditProps {
  staff: StaffMember;
  onSuccess: () => void;
  onClose: () => void;
}

export const useStaffEdit = ({ staff, onSuccess, onClose }: UseStaffEditProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { uploadProfileImage, isUploading } = useStaffStorage();

  const handleSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Updating staff member:', staff.id);
      console.log('Form data:', data);
      
      // Check if there's a new image to upload
      let imageUrl = staff.avatar_url || staff.avatar || staff.image;
      
      if (data.profile_image) {
        console.log('Uploading new profile image...');
        const uploadedUrl = await uploadProfileImage(data.profile_image);
        
        if (uploadedUrl) {
          console.log('Image uploaded successfully:', uploadedUrl);
          imageUrl = uploadedUrl;
        } else {
          console.warn('Failed to upload image, keeping existing image URL');
        }
      }
      
      // If using demo data (IDs starting with 'staff-'), simulate update
      if (staff.id.startsWith('staff-')) {
        // Wait a moment to simulate server processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: 'Staff Member Updated (Demo)',
          description: `${data.name} has been updated (Note: This is demo data)`,
        });
        
        onSuccess();
        onClose();
        return;
      }
      
      // For real data, update in Supabase
      const { error } = await supabase
        .from('staff')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          status: data.status,
          salary: data.salary,
          department: data.department,
          emergency_contact: data.emergency_contact,
          // Set all image-related fields to the same URL for maximum compatibility
          avatar_url: imageUrl,
          avatar: imageUrl,
          image: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', staff.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Staff Member Updated',
        description: `${data.name} has been updated successfully.`,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting: isSubmitting || isUploading
  };
};
