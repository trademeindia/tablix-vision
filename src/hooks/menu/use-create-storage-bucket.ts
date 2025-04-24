
import { supabase } from '@/lib/supabaseClient';

/**
 * Initialize storage buckets for the application
 * This ensures the required storage buckets exist and have proper security policies
 */
export const initializeStorage = async (): Promise<boolean> => {
  try {
    // Check if we already have the required buckets
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
      
    if (error) {
      console.error('Error checking storage buckets:', error);
      return false;
    }
    
    // Log found buckets
    const bucketNames = buckets.map(b => b.name).join(', ');
    console.log(`Found existing buckets: ${bucketNames || 'None'}`);
    
    // Check if menu-media bucket exists
    const hasMenuMediaBucket = buckets.some(bucket => bucket.name === 'menu-media');
    
    if (!hasMenuMediaBucket) {
      console.log('Menu-media bucket does not exist. It should be created through migrations.');
    } else {
      console.log('Menu-media bucket exists');
      
      // Test storage permissions
      try {
        const testFilePath = `_test_${Date.now()}.txt`;
        const { error: uploadError } = await supabase.storage
          .from('menu-media')
          .upload(testFilePath, new Blob(['test']), {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Storage permission test failed:', uploadError);
        } else {
          console.log('Storage permission test successful');
          
          // Clean up test file
          await supabase.storage
            .from('menu-media')
            .remove([testFilePath]);
        }
      } catch (testError) {
        console.error('Error testing storage permissions:', testError);
      }
    }
    
    // Check for avatars bucket for profile images
    const hasAvatarsBucket = buckets.some(bucket => bucket.name === 'avatars');
    
    if (!hasAvatarsBucket) {
      console.log('Avatars bucket does not exist. It should be created through migrations.');
    } else {
      console.log('Avatars bucket exists');
    }
    
    return true;
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    return false;
  }
};
