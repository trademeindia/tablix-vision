
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to subscribe to real-time updates for menu items
 * @param restaurantId The restaurant ID to filter menu items by
 * @param onItemsChange Optional callback when items are updated
 */
export const useRealtimeMenu = (
  restaurantId?: string,
  onItemsChange?: (items: MenuItem[]) => void
) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial data fetch and realtime subscription
  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Initial fetch of menu items
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('name');

        if (error) throw error;

        // Transform data to match MenuItem type
        const transformedItems: MenuItem[] = data?.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        })) || [];

        setMenuItems(transformedItems);
        if (onItemsChange) onItemsChange(transformedItems);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menu items'));
        
        toast({
          title: 'Error loading menu',
          description: 'Could not load menu items. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();

    // Set up realtime subscription for menu items
    const channel = supabase
      .channel('menu-items-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        async (payload) => {
          console.log('Realtime menu update:', payload);

          try {
            // Re-fetch the complete list to ensure we have the most up-to-date data
            // This is more reliable than trying to update the list based on the payload
            const { data, error } = await supabase
              .from('menu_items')
              .select('*')
              .eq('restaurant_id', restaurantId)
              .order('name');

            if (error) throw error;

            // Transform data to match MenuItem type
            const transformedItems: MenuItem[] = data?.map(item => ({
              ...item,
              allergens: parseAllergens(item.allergens)
            })) || [];

            setMenuItems(transformedItems);
            if (onItemsChange) onItemsChange(transformedItems);
            
            // Show a toast notification about the update
            if (payload.eventType === 'INSERT') {
              toast({
                title: 'Menu Updated',
                description: 'A new menu item has been added.',
              });
            } else if (payload.eventType === 'UPDATE') {
              toast({
                title: 'Menu Updated',
                description: 'A menu item has been updated.',
              });
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: 'Menu Updated',
                description: 'A menu item has been removed.',
              });
            }
          } catch (err) {
            console.error('Error handling menu item update:', err);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, onItemsChange]);

  return {
    menuItems,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('name');

        if (error) throw error;

        // Transform data to match MenuItem type
        const transformedItems: MenuItem[] = data?.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        })) || [];

        setMenuItems(transformedItems);
        if (onItemsChange) onItemsChange(transformedItems);
      } catch (err) {
        console.error('Error refetching menu items:', err);
        setError(err instanceof Error ? err : new Error('Failed to refetch menu items'));
      } finally {
        setIsLoading(false);
      }
    }
  };
};
