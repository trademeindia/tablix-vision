
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';

interface UseMenuDataResult {
  categories: MenuCategory[] | null;
  items: MenuItem[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMenuData(restaurantId: string | null): UseMenuDataResult {
  const categoriesQuery = useQuery({
    queryKey: ['menuCategories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('display_order', { ascending: true });
      
      if (error) throw new Error(`Error fetching categories: ${error.message}`);
      return data as MenuCategory[];
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  const itemsQuery = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true);
      
      if (error) throw new Error(`Error fetching items: ${error.message}`);
      
      // Transform the items data
      const transformedItems = data.map(item => ({
        ...item,
        allergens: parseAllergens(item.allergens)
      }));
      
      return transformedItems as MenuItem[];
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    categories: categoriesQuery.data || null,
    items: itemsQuery.data || null,
    isLoading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error: categoriesQuery.error || itemsQuery.error,
  };
}
