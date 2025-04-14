
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, parseAllergens } from '@/types/menu';

interface UseRealtimeMenuResult {
  menuItems: MenuItem[];
  isLoading: boolean;
}

export function useRealtimeMenu(restaurantId: string | undefined): UseRealtimeMenuResult {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    console.log(`Setting up real-time menu subscription for restaurant: ${restaurantId}`);
    
    // First fetch current items
    const fetchInitialItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);
        
        if (error) {
          console.error('Error fetching initial menu items:', error);
          return;
        }
        
        // Transform the items data
        const transformedItems = (data || []).map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));
        
        setMenuItems(transformedItems as MenuItem[]);
      } catch (err) {
        console.error('Exception fetching initial menu items:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialItems();
    
    // Set up realtime subscription
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
          
          if (payload.eventType === 'INSERT') {
            // Add the new item to the state
            const newItem = {
              ...payload.new,
              allergens: parseAllergens(payload.new.allergens)
            } as MenuItem;
            
            console.log('Adding new menu item to state:', newItem);
            setMenuItems(currentItems => [...currentItems, newItem]);
          } 
          else if (payload.eventType === 'UPDATE') {
            // Update the existing item in the state
            const updatedItem = {
              ...payload.new,
              allergens: parseAllergens(payload.new.allergens)
            } as MenuItem;
            
            console.log('Updating menu item in state:', updatedItem);
            setMenuItems(currentItems => 
              currentItems.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              )
            );
          } 
          else if (payload.eventType === 'DELETE') {
            // Remove the deleted item from the state
            console.log('Removing menu item from state:', payload.old.id);
            setMenuItems(currentItems => 
              currentItems.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Menu realtime subscription status:', status);
      });
    
    // Also subscribe to category changes
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
          
          // For category deletion, we should update affected menu items
          if (payload.eventType === 'DELETE') {
            const deletedCategoryId = payload.old.id;
            
            setMenuItems(currentItems => 
              currentItems.map(item => {
                if (item.category_id === deletedCategoryId) {
                  return { ...item, category_id: null };
                }
                return item;
              })
            );
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
  }, [restaurantId]);
  
  return { menuItems, isLoading };
}
