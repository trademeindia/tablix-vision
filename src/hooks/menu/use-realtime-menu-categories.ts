import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory } from '@/types/menu';

export function useRealtimeMenuCategories(restaurantId: string | undefined) {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const channel = supabase
      .channel('menu_categories:' + restaurantId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: 'restaurant_id=eq.' + restaurantId,
        },
        (payload) => {
          console.log('Menu category change detected:', payload);
          fetchMenuCategories();
        }
      )
      .subscribe(status => {
        console.log('Realtime subscription status: ' + status);
        setIsLoading(false);
      });

    // Function to fetch menu categories from Supabase
    const fetchMenuCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching menu categories:', error);
        }

        setMenuCategories((data || []) as MenuCategory[]);
      } catch (error) {
        console.error('Error fetching menu categories:', error);
      }
    };

    // Initial fetch of menu categories
    fetchMenuCategories();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  return { menuCategories, isLoading };
}