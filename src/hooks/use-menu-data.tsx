
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';

interface UseMenuDataResult {
  categories: MenuCategory[] | null;
  items: MenuItem[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMenuData(restaurantId: string | null): UseMenuDataResult {
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenuData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });

        if (categoryError) {
          throw new Error(`Error fetching categories: ${categoryError.message}`);
        }

        setCategories(categoryData);

        // Fetch items
        const { data: itemData, error: itemError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);

        if (itemError) {
          throw new Error(`Error fetching items: ${itemError.message}`);
        }

        // Transform the items data
        const transformedItems = itemData.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));

        setItems(transformedItems);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching menu data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId]);

  return { categories, items, isLoading, error };
}
