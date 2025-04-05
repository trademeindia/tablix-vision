
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/profile';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      const fetchedProfile = data as Profile;
      setProfile(fetchedProfile);
      return fetchedProfile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; data?: Profile; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('No authenticated user found') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setProfile(data as Profile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile changes were saved successfully.',
      });
      
      return { success: true, data: data as Profile };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error updating profile:', err);
      
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
      
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<{ publicUrl?: string; error?: Error }> => {
    if (!user) {
      return { error: new Error('No authenticated user found') };
    }
    
    if (!file) {
      return { error: new Error('No file provided') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profiles/${user.id}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update the user's profile with the new image URL
      await updateProfile({
        avatar_url: publicUrl
      });
      
      return { publicUrl };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error uploading profile image:', err);
      
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your profile image.',
        variant: 'destructive',
      });
      
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('No authenticated user found') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First, delete user data from the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Then, delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw authError;
      
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error deleting account:', err);
      
      toast({
        title: 'Account deletion failed',
        description: 'There was an error deleting your account.',
        variant: 'destructive',
      });
      
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    profile,
    fetchProfile,
    updateProfile,
    uploadProfileImage,
    deleteAccount,
  };
};
