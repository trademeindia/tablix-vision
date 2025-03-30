
import { supabase } from "@/integrations/supabase/client";

/**
 * Get total revenue for a specific time period
 */
export const getRevenue = async (
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
    
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());
    
    if (error) {
      console.error('Error fetching revenue:', error);
      return 0;
    }
    
    return data.reduce((total, order) => total + (order.total_amount || 0), 0);
  } catch (error) {
    console.error('Error in getRevenue:', error);
    return 0;
  }
};

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
    // This requires a more complex query with joins
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
    
    // Count occurrences of each item
    const itemCounts = data.reduce((acc, item) => {
      const { name } = item;
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array and sort by count
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

/**
 * Get daily sales data for chart visualization
 */
export const getSalesData = async (
  restaurantId: string,
  days: number = 14
): Promise<Array<{name: string, total: number}>> => {
  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
    
    // Create a map for all days in the range with 0 sales
    const dailySales: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailySales[dateStr] = 0;
    }
    
    // Add actual sales data
    data.forEach(order => {
      const dateStr = new Date(order.created_at).toISOString().split('T')[0];
      if (dailySales[dateStr] !== undefined) {
        dailySales[dateStr] += order.total_amount || 0;
      }
    });
    
    // Convert to array for chart
    return Object.entries(dailySales).map(([date, total]) => ({
      name: date,
      total: Math.round(total * 100) / 100
    }));
  } catch (error) {
    console.error('Error in getSalesData:', error);
    return [];
  }
};
