
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches average order value data for a restaurant
 * @param restaurantId - The restaurant ID to fetch data for
 * @returns Array of data points with name (date) and value (average order amount)
 */
export async function getAverageOrderValue(restaurantId: string): Promise<Array<{name: string, value: number}>> {
  try {
    // Get current date and 14 days ago for our data range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13); // Get 14 days of data (including today)
    
    // Format dates for database query
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Query to get average order value by day
    const { data, error } = await supabase.rpc('get_average_order_by_day', {
      restaurant_id_param: restaurantId,
      start_date_param: startDateStr,
      end_date_param: endDateStr
    });
    
    if (error) {
      console.error('Error fetching average order data:', error);
      throw error;
    }
    
    // If we have data, format it for the chart
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.order_date,
        value: parseFloat(item.average_amount) || 0
      }));
    }
    
    // If no data, return empty array
    return [];
  } catch (error) {
    console.error('Exception in getAverageOrderValue:', error);
    throw error;
  }
}
