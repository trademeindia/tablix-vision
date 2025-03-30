
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
 * Calculate loyalty points for an order amount
 * @param amount Order amount
 * @returns Number of points earned
 */
export const calculateLoyaltyPoints = (amount: number): number => {
  // 1 point for every $50 spent, rounded down
  return Math.floor(amount / 50);
};

/**
 * Add loyalty points to a customer by increasing their expenditure
 * @param customerId The customer ID
 * @param points Number of points to add
 */
export const addLoyaltyPoints = async (customerId: string, points: number): Promise<void> => {
  // Convert points to expenditure value (1 point = $50)
  const expenditureToAdd = points * 50;
  
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
    const newExpenditure = currentExpenditure + expenditureToAdd;

    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        total_expenditure: newExpenditure,
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error updating loyalty points:', updateError);
    }
  } catch (error) {
    console.error('Error in addLoyaltyPoints:', error);
  }
};

/**
 * Redeem loyalty points for a customer
 * @param customerId The customer's ID
 * @param pointsToRedeem The number of points to redeem
 * @returns Object with success status, remaining points, and discount amount
 */
export const redeemLoyaltyPoints = async (customerId: string, pointsToRedeem: number): Promise<{
  success: boolean;
  remainingPoints: number;
  discountAmount: number;
}> => {
  try {
    // Get current loyalty points
    const currentPoints = await getLoyaltyPoints(customerId);
    
    // Check if customer has enough points
    if (currentPoints < pointsToRedeem) {
      return {
        success: false,
        remainingPoints: currentPoints,
        discountAmount: 0
      };
    }
    
    // Get current customer data
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('total_expenditure')
      .eq('id', customerId)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return {
        success: false,
        remainingPoints: currentPoints,
        discountAmount: 0
      };
    }

    // Calculate discount amount (1 point = $5 in discount)
    const discountAmount = pointsToRedeem * 5;

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
      return {
        success: false,
        remainingPoints: currentPoints,
        discountAmount: 0
      };
    }

    // Calculate remaining points after redemption
    const remainingPoints = Math.floor(newExpenditure / 50);

    return {
      success: true,
      remainingPoints,
      discountAmount
    };
  } catch (error) {
    console.error('Error in redeemLoyaltyPoints:', error);
    return {
      success: false,
      remainingPoints: 0,
      discountAmount: 0
    };
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
