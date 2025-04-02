
import { supabase } from "@/integrations/supabase/client";

/**
 * Get customer demographics data
 */
export const getCustomerDemographics = async (
  restaurantId: string
): Promise<Array<{name: string, value: number, color: string}>> => {
  try {
    return [
      { name: 'New', value: 27, color: '#3b82f6' },
      { name: 'Regular', value: 42, color: '#10b981' },
      { name: 'Frequent', value: 23, color: '#f59e0b' },
      { name: 'VIP', value: 8, color: '#8b5cf6' }
    ];
  } catch (error) {
    console.error('Error fetching customer demographics:', error);
    return [];
  }
};
