
import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate loyalty points based on order total
 * @param amount Order total amount
 * @returns Number of points earned
 */
export const calculateLoyaltyPoints = (amount: number): number => {
  // Award 1 point for every 50 spent
  return Math.floor(amount / 50);
};

/**
 * Add loyalty points to a customer
 * @param customerId Customer ID
 * @param points Points to add
 * @returns Updated customer with new points total
 */
export const addLoyaltyPoints = async (customerId: string, points: number) => {
  if (!customerId || points <= 0) return null;

  try {
    // Get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();

    if (getError) {
      console.error('Error fetching customer points:', getError);
      return null;
    }

    const currentPoints = customer?.loyalty_points || 0;
    const newTotal = currentPoints + points;

    // Update customer with new points total
    const { data, error } = await supabase
      .from('customers')
      .update({ loyalty_points: newTotal })
      .eq('id', customerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating loyalty points:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addLoyaltyPoints:', error);
    return null;
  }
};

/**
 * Get customer's loyalty points
 * @param customerId Customer ID
 * @returns Current loyalty points
 */
export const getLoyaltyPoints = async (customerId: string): Promise<number> => {
  if (!customerId) return 0;

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error fetching loyalty points:', error);
      return 0;
    }

    return data?.loyalty_points || 0;
  } catch (error) {
    console.error('Error in getLoyaltyPoints:', error);
    return 0;
  }
};

/**
 * Redeem loyalty points for a discount
 * @param customerId Customer ID
 * @param pointsToRedeem Points to redeem
 * @returns Discount amount and updated points
 */
export const redeemLoyaltyPoints = async (
  customerId: string,
  pointsToRedeem: number
): Promise<{ discountAmount: number; remainingPoints: number } | null> => {
  if (!customerId || pointsToRedeem <= 0) return null;

  try {
    // Get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();

    if (getError) {
      console.error('Error fetching customer points:', getError);
      return null;
    }

    const currentPoints = customer?.loyalty_points || 0;

    // Ensure customer has enough points
    if (currentPoints < pointsToRedeem) {
      return null;
    }

    // Calculate discount amount (1 point = Rs. 5 discount)
    const discountAmount = pointsToRedeem * 5;
    const remainingPoints = currentPoints - pointsToRedeem;

    // Update customer with new points total
    const { error } = await supabase
      .from('customers')
      .update({ loyalty_points: remainingPoints })
      .eq('id', customerId);

    if (error) {
      console.error('Error updating loyalty points after redemption:', error);
      return null;
    }

    return { discountAmount, remainingPoints };
  } catch (error) {
    console.error('Error in redeemLoyaltyPoints:', error);
    return null;
  }
};
