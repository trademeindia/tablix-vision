
import { supabase } from '@/integrations/supabase/client';

/**
 * Get loyalty points for a customer
 * @param customerId The customer's ID
 * @returns The number of loyalty points or 0 if not found
 */
export const getLoyaltyPoints = async (customerId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('total_expenditure')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error fetching loyalty points:', error);
      return 0;
    }

    // Calculate loyalty points based on expenditure
    // 1 point for every $50 spent
    const totalExpenditure = data.total_expenditure || 0;
    const loyaltyPoints = Math.floor(totalExpenditure / 50);
    
    return loyaltyPoints;
  } catch (error) {
    console.error('Error in getLoyaltyPoints:', error);
    return 0;
  }
};

/**
 * Update loyalty points for a customer after an order
 * @param customerId The customer's ID
 * @param orderAmount The amount spent in the order
 */
export const updateLoyaltyPoints = async (customerId: string, orderAmount: number): Promise<void> => {
  try {
    // Get current customer data
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('total_expenditure')
      .eq('id', customerId)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return;
    }

    // Update the total expenditure
    const currentExpenditure = customer.total_expenditure || 0;
    const newExpenditure = currentExpenditure + orderAmount;

    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        total_expenditure: newExpenditure,
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error updating expenditure:', updateError);
    }
  } catch (error) {
    console.error('Error in updateLoyaltyPoints:', error);
  }
};

/**
 * Redeem loyalty points for a customer
 * @param customerId The customer's ID
 * @param pointsToRedeem The number of points to redeem
 * @returns Boolean indicating success or failure
 */
export const redeemLoyaltyPoints = async (customerId: string, pointsToRedeem: number): Promise<boolean> => {
  try {
    // Get current loyalty points
    const currentPoints = await getLoyaltyPoints(customerId);
    
    // Check if customer has enough points
    if (currentPoints < pointsToRedeem) {
      return false;
    }
    
    // Get current customer data
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('total_expenditure')
      .eq('id', customerId)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return false;
    }

    // Calculate new expenditure after redeeming points
    // (Reducing expenditure is how we track point usage)
    const currentExpenditure = customer.total_expenditure || 0;
    const pointsValue = pointsToRedeem * 50; // Each point is worth $50 in expenditure
    const newExpenditure = Math.max(0, currentExpenditure - pointsValue);

    // Update the customer record
    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        total_expenditure: newExpenditure
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error redeeming points:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in redeemLoyaltyPoints:', error);
    return false;
  }
};

/**
 * Calculate discount amount based on loyalty points
 * @param points Number of points to redeem
 * @returns The discount amount
 */
export const calculateLoyaltyDiscount = (points: number): number => {
  // Each point is worth $5 in discount
  return points * 5;
};
