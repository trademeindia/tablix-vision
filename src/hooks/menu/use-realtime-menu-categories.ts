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
          
          if (payload.eventType === 'INSERT') {
            const newCategory = payload.new as MenuCategory;
            setMenuCategories(currentCategories => {
              const exists = currentCategories.some(category => category.id === newCategory.id);
              if (exists) {
                return currentCategories;
              }
              return [...currentCategories, newCategory];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedCategory = payload.new as MenuCategory;
            setMenuCategories(currentCategories =>
              currentCategories.map(category =>
                category.id === updatedCategory.id ? updatedCategory : category
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMenuCategories(currentCategories =>
              currentCategories.filter(category => category.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe(status => {
        console.log('Realtime subscription status: ' + status);
        setIsLoading(false);
      });

:start_line:58
-------
    // Initial fetch of menu categories
-------
    // Initial fetch of menu categories
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