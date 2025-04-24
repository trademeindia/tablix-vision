
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define menu types
export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  restaurant_id?: string;
  media_type?: string;
  media_reference?: string;
  is_available: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hook to fetch menu data with real-time updates
 */
export const useMenuDataWithRealtime = (restaurantId?: string) => {
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  // Fetch menu categories
  const { 
    data: categoriesData, 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['menuCategories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      return data as MenuCategory[];
    },
    enabled: !!restaurantId
  });

  // Fetch menu items
  const { 
    data: itemsData, 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurantId
  });

  // Set up realtime subscriptions
  useEffect(() => {
    if (!restaurantId) return;
    
    // Clean up existing channels
    channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    
    // Set up realtime for categories
    const categoriesChannel = supabase.channel('menu_categories_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_categories',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (_payload) => {
          refetchCategories();
        }
      )
      .subscribe();
    
    // Set up realtime for items
    const itemsChannel = supabase.channel('menu_items_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (_payload) => {
          refetchItems();
        }
      )
      .subscribe();
    
    // Store channels for cleanup
    setChannels([categoriesChannel, itemsChannel]);
    
    // Clean up
    return () => {
      categoriesChannel && supabase.removeChannel(categoriesChannel);
      itemsChannel && supabase.removeChannel(itemsChannel);
    };
  }, [restaurantId, refetchCategories, refetchItems]);

  // Update state from data
  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);
  
  useEffect(() => {
    if (itemsData) setItems(itemsData);
  }, [itemsData]);

  return {
    categories,
    items,
    isCategoriesLoading,
    isItemsLoading,
    categoriesError,
    itemsError
  };
};
