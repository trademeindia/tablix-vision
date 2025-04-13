import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, parseAllergens } from '@/types/menu';

export function useRealTimeMenu(restaurantId: string | null, enabled: boolean = true) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!restaurantId || !enabled) return;
    
    console.log(`Setting up real-time menu subscription for restaurant: ${restaurantId}`);
    
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Realtime menu update received:', payload);

          // Get current cached data
          const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', restaurantId]) || [];
          
          if (payload.eventType === 'INSERT') {
            // Add the new item to the cache
            const newItem = {
              ...payload.new,
              allergens: parseAllergens(payload.new.allergens)
            };
            
            console.log('Adding new menu item to cache:', newItem);
            queryClient.setQueryData(['menuItems', restaurantId], [...currentItems, newItem]);
          } 
          else if (payload.eventType === 'UPDATE') {
            // Update the existing item in the cache
            const updatedItem = {
              ...payload.new,
              allergens: parseAllergens(payload.new.allergens)
            };
            
            console.log('Updating menu item in cache:', updatedItem);
            const updatedItems = currentItems.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            );
            
            queryClient.setQueryData(['menuItems', restaurantId], updatedItems);
          } 
          else if (payload.eventType === 'DELETE') {
            // Remove the deleted item from the cache
            console.log('Removing menu item from cache:', payload.old.id);
            const filteredItems = currentItems.filter(item => item.id !== payload.old.id);
            
            queryClient.setQueryData(['menuItems', restaurantId], filteredItems);
          }
        }
      )
      .subscribe((status) => {
        console.log('Menu realtime subscription status:', status);
      });
    
    // Also subscribe to category changes to keep menus in sync
    const categoryChannel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Realtime category update received:', payload);
          
          // Invalidate category cache on any change
          queryClient.invalidateQueries({ queryKey: ['menuCategories', restaurantId] });
          
          // For category deletion, we should also update menu items that reference it
          if (payload.eventType === 'DELETE') {
            const deletedCategoryId = payload.old.id;
            
            // Get current cached items
            const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', restaurantId]) || [];
            
            // Update category ID for affected items
            const updatedItems = currentItems.map(item => {
              if (item.category_id === deletedCategoryId) {
                return { ...item, category_id: null };
              }
              return item;
            });
            
            queryClient.setQueryData(['menuItems', restaurantId], updatedItems);
          }
        }
      )
      .subscribe();
    
    // Clean up subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time menu subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(categoryChannel);
    };
  }, [restaurantId, queryClient, enabled]);
  
  return null; // This hook just sets up subscriptions
}
