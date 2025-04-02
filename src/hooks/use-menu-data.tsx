
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

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
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      console.log("Fetching categories for restaurant:", restaurantId);
      
      try {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error("Error fetching categories:", error);
          throw new Error(`Error fetching categories: ${error.message}`);
        }
        
        console.log("Categories fetched:", data?.length || 0);
        
        // If no categories found for this restaurant, show a user-friendly message
        if (!data || data.length === 0) {
          console.log("No categories found for restaurant:", restaurantId);
          // Return empty array instead of null to avoid errors in components
          return [];
        }
        
        return data as MenuCategory[];
      } catch (error) {
        console.error("Error in categoriesQuery:", error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3, // Retry failed requests three times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
  
  const itemsQuery = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      try {
        console.log("Fetching menu items for restaurant:", restaurantId);
        
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);
        
        if (error) {
          console.error("Error fetching items:", error);
          throw new Error(`Error fetching items: ${error.message}`);
        }
        
        console.log("Items fetched:", data?.length || 0);
        
        // If no items found for this restaurant, show a user-friendly message
        if (!data || data.length === 0) {
          console.log("No menu items found for restaurant:", restaurantId);
          return [];
        }
        
        // Transform the items data
        const transformedItems = data.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens)
        }));
        
        return transformedItems as MenuItem[];
      } catch (error) {
        console.error("Error in fetchMenuItems query:", error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3, // Retry failed requests three times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const refetchCategories = async () => {
    try {
      console.log("Manually refetching menu data...");
      await Promise.all([
        categoriesQuery.refetch(),
        itemsQuery.refetch()
      ]);
      console.log("Refetch complete");
    } catch (error) {
      console.error("Error refetching data:", error);
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
