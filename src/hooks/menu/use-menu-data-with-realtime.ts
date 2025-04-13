
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { useRealTimeMenu } from './use-real-time-menu';

interface UseMenuDataResult {
  categories: MenuCategory[];
  items: MenuItem[];
  isLoading: boolean;
  error: Error | null;
  refetchCategories: () => Promise<void>;
}

export function useMenuDataWithRealtime(restaurantId: string | null): UseMenuDataResult {
  // Set up real-time subscriptions
  useRealTimeMenu(restaurantId, !!restaurantId);
  
  // Use optimized query key structures for better cache management
  const categoriesQuery = useQuery({
    queryKey: ['menuCategories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      try {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });
        
        if (error) {
          throw new Error(`Error fetching categories: ${error.message}`);
        }
        
        // Return empty array instead of null to avoid errors in components
        return (data || []) as MenuCategory[];
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
  
  const itemsQuery = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);
        
        if (error) {
          throw new Error(`Error fetching items: ${error.message}`);
        }
        
        // Transform the items data, with empty array fallback
        const transformedItems = (data || []).map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));
        
        return transformedItems as MenuItem[];
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  const refetchCategories = async () => {
    try {
      await Promise.all([
        categoriesQuery.refetch(),
        itemsQuery.refetch()
      ]);
    } catch (error) {
      toast({
        title: "Failed to refresh data",
        description: "Please try again or check your connection",
        variant: "destructive"
      });
    }
  };

  return {
    categories: categoriesQuery.data || [],
    items: itemsQuery.data || [],  // Return empty array instead of null
    isLoading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error: categoriesQuery.error || itemsQuery.error,
    refetchCategories
  };
}
