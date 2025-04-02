
import { supabase } from "@/integrations/supabase/client";

/**
 * Get order count for a specific time period
 */
export const getOrderCount = async (
  restaurantId: string,
  period: 'week' | 'month' | 'year'
): Promise<number> => {
  try {
    const now = new Date();
    let startDate: Date;
    
    // Calculate the start date based on the period
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());
    
    if (error) {
      console.error('Error fetching order count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getOrderCount:', error);
    return 0;
  }
};

/**
 * Get most popular menu items based on order frequency
 */
export const getPopularItems = async (
  restaurantId: string,
  limit: number = 5
): Promise<Array<{name: string, count: number}>> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        name,
        menu_item_id,
        order_id,
        orders!inner(restaurant_id)
      `)
      .eq('orders.restaurant_id', restaurantId);
    
    if (error) {
      console.error('Error fetching popular items:', error);
      return [];
    }
    
    const itemCounts = data.reduce((acc, item) => {
      const { name } = item;
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name]++;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return sortedItems;
  } catch (error) {
    console.error('Error in getPopularItems:', error);
    return [];
  }
};
