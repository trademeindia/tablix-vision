
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

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
          .eq('restaurant_id', restaurantId);
        
        if (error) {
          console.error('Error fetching initial menu items:', error);
          toast({
            title: "Failed to load menu items",
            description: error.message,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Fetched initial menu items:', data?.length || 0);
        
        // Transform the items data
        const transformedItems = (data || []).map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));
        
        setMenuItems(transformedItems as MenuItem[]);
        setIsLoading(false);
      } catch (err) {
        console.error('Exception fetching initial menu items:', err);
        setIsLoading(false);
      }
    };
    
    fetchInitialItems();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('menu-items-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Realtime menu update received:', payload.eventType, payload);
          
          try {
            if (payload.eventType === 'INSERT') {
              // Add the new item to the state
              const newItem = {
                ...payload.new,
                allergens: parseAllergens(payload.new.allergens)
              } as MenuItem;
              
              console.log('Adding new menu item to state:', newItem);
              setMenuItems(currentItems => {
                // Check if item already exists to prevent duplicates
                const exists = currentItems.some(item => item.id === newItem.id);
                if (exists) {
                  return currentItems;
                }
                return [...currentItems, newItem];
              });
              
              toast({
                title: "New item added",
                description: `"${newItem.name}" has been added to the menu`,
              });
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
              
              toast({
                title: "Menu item updated",
                description: `"${updatedItem.name}" has been updated`,
              });
            } 
            else if (payload.eventType === 'DELETE') {
              // Remove the deleted item from the state
              console.log('Removing menu item from state:', payload.old.id);
              setMenuItems(currentItems => 
                currentItems.filter(item => item.id !== payload.old.id)
              );
              
              toast({
                title: "Menu item removed",
                description: "A menu item has been removed from the menu",
              });
            }
          } catch (error) {
            console.error('Error processing realtime update:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Menu realtime subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.error('Error connecting to realtime channel');
          toast({
            title: "Realtime connection error",
            description: "Failed to connect to realtime updates. Changes may not appear immediately.",
            variant: "destructive"
          });
        }
      });
    
    // Clean up subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time menu subscriptions');
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);
  
  return { menuItems, isLoading };
}
