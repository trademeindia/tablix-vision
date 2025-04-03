
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffFormData } from '@/types/staff';
import { useStaffStorage } from './use-staff-storage';

interface UseStaffFormProps {
  form: UseFormReturn<StaffFormData>;
  onSuccess?: () => void;
}

export const useStaffForm = ({ form, onSuccess }: UseStaffFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { uploadProfileImage } = useStaffStorage();

  const handleSubmit = async (data: StaffFormData) => {
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
          
        if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows returned", which is fine
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
      const { profile_image, emergency_contact, ...restData } = data;
      
      // Ensure salary is properly typed for the database
      const staffData = {
        ...restData,
        salary: data.salary ? Number(data.salary) : null,
        emergency_contact: emergency_contact || null,
        hire_date: data.hire_date || null
      };
      
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
      onSuccess?.();
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

  return {
    handleSubmit,
    isSubmitting
  };
};
