
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, setupRealtimeListener } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem } from '@/types/menu';

export const useMenuDataWithRealtime = (restaurantId?: string) => {
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);

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
    
    // Set up realtime for categories
    const categoriesChannel = setupRealtimeListener(
      'menu_categories',
      '*', 
      (_payload) => {
        refetchCategories();
      },
      'restaurant_id',
      restaurantId
    );
    
    // Set up realtime for items
    const itemsChannel = setupRealtimeListener(
      'menu_items',
      '*', 
      (_payload) => {
        refetchItems();
      },
      'restaurant_id',
      restaurantId
    );
    
    // Clean up
    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(itemsChannel);
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
