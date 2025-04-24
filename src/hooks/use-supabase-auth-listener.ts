import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSupabaseAuthListener() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Auth state changed:', session);
    });

    return () => subscription.unsubscribe();
  }, []);
}
