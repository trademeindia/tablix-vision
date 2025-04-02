
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

interface UseMenuDataResult {
  categories: MenuCategory[];
  items: MenuItem[] | null;
  isLoading: boolean;
  error: Error | null;
  refetchCategories: () => Promise<void>;
}

export function useMenuData(restaurantId: string | null): UseMenuDataResult {
  const categoriesQuery = useQuery({
    queryKey: ['menuCategories', restaurantId],
    queryFn: async () => {
      try {
        if (!restaurantId) {
          throw new Error('Restaurant ID is required');
        }
        
        console.log("Fetching categories for restaurant:", restaurantId);
        
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });
        
        if (error) {
          throw new Error(`Error fetching categories: ${error.message}`);
        }
        
        console.log("Categories fetched:", data?.length || 0, data);
        
        // If no categories found, we'll return an empty array instead of null
        return (data || []) as MenuCategory[];
      } catch (error) {
        return handleError(error, { 
          context: 'fetchCategories',
          showToast: false // We'll handle toast in the component
        }).originalError;
      }
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });
  
  const itemsQuery = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      try {
        if (!restaurantId) {
          throw new Error('Restaurant ID is required');
        }
        
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);
        
        if (error) {
          throw new Error(`Error fetching items: ${error.message}`);
        }
        
        // Transform the items data
        const transformedItems = data.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));
        
        return transformedItems as MenuItem[];
      } catch (error) {
        return handleError(error, {
          context: 'fetchMenuItems',
          showToast: false // We'll handle toast in the component
        }).originalError;
      }
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  const refetchCategories = async () => {
    try {
      await categoriesQuery.refetch();
      await itemsQuery.refetch();
    } catch (error) {
      handleError(error, {
        context: 'refetchMenuData',
        showToast: true
      });
    }
  };

  return {
    categories: categoriesQuery.data || [],
    items: itemsQuery.data || null,
    isLoading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error: categoriesQuery.error || itemsQuery.error,
    refetchCategories
  };
}
