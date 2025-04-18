import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCategory, MenuItem, parseAllergens } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { useRealtimeMenu } from './use-realtime-menu';
import { useRealtimeMenuCategories } from './use-realtime-menu-categories';

interface UseMenuDataResult {
  categories: MenuCategory[];
  items: MenuItem[];
  isLoading: boolean;
  error: Error | null;
}

export function useMenuDataWithRealtime(restaurantId: string | null): UseMenuDataResult {
  // Use the reusable realtime menu hook
  const { menuItems: realtimeItems, isLoading: realtimeLoading } = useRealtimeMenu(
    restaurantId || undefined
  );

  // Use the new realtime menu categories hook
  const { menuCategories: realtimeCategories, isLoading: realtimeCategoriesLoading } = useRealtimeMenuCategories(
    restaurantId || undefined
  );
  
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
          console.error('Error fetching menu categories:', error);
          toast({
            title: "Error fetching menu categories",
            description: "Please try again or check your connection",
            variant: "destructive"
          });
          throw new Error(`Error fetching categories: ${error.message}`);
        }

        // Return empty array instead of null to avoid errors in components
        return (data || []) as MenuCategory[];
      } catch (error: any) {
        console.error('Error fetching menu categories:', error);
        toast({
          title: "Error fetching menu categories",
          description: "Please try again or check your connection",
          variant: "destructive"
        });
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 300000, // 5 minutes
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
          console.error('Error fetching menu items:', error);
          toast({
            title: "Error fetching menu items",
            description: "Please try again or check your connection",
            variant: "destructive"
          });
          throw new Error(`Error fetching items: ${error.message}`);
        }

        return (data || []) as MenuItem[];
      } catch (error: any) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error fetching menu items",
          description: "Please try again or check your connection",
          variant: "destructive"
        });
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!restaurantId,
    staleTime: 300000, // 5 minutes
  });

  return {
    // Use realtime categories if available, otherwise use query data
    categories: realtimeCategories.length > 0 ? realtimeCategories : (categoriesQuery.data || []),
    // Use realtime items if available, otherwise use query data
    items: realtimeItems.length > 0 ? realtimeItems : (itemsQuery.data || []),
    isLoading: categoriesQuery.isLoading || itemsQuery.isLoading || realtimeLoading || realtimeCategoriesLoading,
    error: categoriesQuery.error || itemsQuery.error,
  };
}
