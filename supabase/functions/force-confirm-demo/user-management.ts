
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Function to ensure the demo user exists and is properly configured
export async function ensureDemoUser(supabase: any, demoEmail: string) {
  console.log('Ensuring demo user exists:', demoEmail);
  
  try {
    // Try to directly sign in the demo user if they exist
    const { data: signInData, error: signInError } = await supabase.auth.admin.signInWithEmail(
      demoEmail,
      'demo123456'
    );

    if (signInError) {
      console.log('Could not directly sign in demo user:', signInError.message);
      // Demo user might not exist, create it
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: 'demo123456',
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      });
      
      if (createError) {
        console.error('Failed to create demo user:', createError.message);
        throw new Error(`Failed to create demo user: ${createError.message}`);
      }
      
      console.log('Created new demo user:', newUser);
      return newUser;
    } else {
      console.log('Successfully signed in demo user');
      return signInData.user;
    }
  } catch (error) {
    console.error('Error in ensureDemoUser:', error);
    throw error;
  }
}

// Function to force confirm a user's email
export async function forceConfirmUserEmail(supabase: any, userId: string) {
  console.log('Force confirming email for user:', userId);
  
  try {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId, 
      { 
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      }
    );
    
    if (updateError) {
      console.error('Error updating demo user via admin API:', updateError);
      return false;
    }
    
    console.log('Successfully confirmed demo user email');
    return true;
  } catch (error) {
    console.error('Error in forceConfirmUserEmail:', error);
    throw error;
  }
}

// Fallback methods for email confirmation when admin API fails
export async function fallbackEmailConfirmation(supabase: any, demoEmail: string) {
  console.log('Attempting fallback email confirmation for:', demoEmail);
  
  try {
    // Try RPC method first
    const { error: directUpdateError } = await supabase
      .rpc('force_confirm_user', { user_email: demoEmail });
    
    if (directUpdateError) {
      console.error('Error with RPC update:', directUpdateError);
      
      // Last resort: try to find user in profiles
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', demoEmail)
        .maybeSingle();
        
      if (userData?.id) {
        console.log('Found user in profiles:', userData.id);
        return true;
      }
      
      console.error('All fallback methods failed');
      return false;
    }
    
    console.log('Successfully confirmed demo user via RPC');
    return true;
  } catch (error) {
    console.error('Error in fallbackEmailConfirmation:', error);
    return false;
  }
}
