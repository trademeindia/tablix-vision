
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { useToast } from './use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch profile. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile. Please try again later.',
          variant: 'destructive',
        });
        return { error };
      }

      setProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
      return { data };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading profile image:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile with image URL:', updateError);
        throw updateError;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, profile_image_url: publicUrl } : null);
      
      toast({
        title: 'Success',
        description: 'Profile image uploaded successfully.',
      });
      
      return { publicUrl };
    } catch (error) {
      console.error('Error in uploadProfileImage:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile image. Please try again later.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const mergeLocalData = async () => {
    if (!user) return;
    
    // Get customer info from local storage
    const storedCustomerInfo = localStorage.getItem('customerInfo');
    if (!storedCustomerInfo) return;
    
    try {
      const customerInfo = JSON.parse(storedCustomerInfo);
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('full_name, phone, email')
        .eq('id', user.id)
        .single();
      
      // Only update if fields are empty
      const updates: Partial<Profile> = {};
      
      if (!existingProfile?.full_name && customerInfo.name) {
        updates.full_name = customerInfo.name;
      }
      
      if (!existingProfile?.phone && customerInfo.phone) {
        updates.phone = customerInfo.phone;
      }
      
      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
      }
    } catch (error) {
      console.error('Error merging local data:', error);
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    fetchProfile();
    // Try to merge local data with profile
    mergeLocalData();
  }, [user?.id]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    uploadProfileImage
  };
};
