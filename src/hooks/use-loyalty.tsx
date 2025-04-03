
import { useState, useEffect, useCallback } from 'react';
import { getLoyaltyPoints, redeemLoyaltyPoints } from '@/services/loyaltyService';
import { useCustomerInfoStorage } from './use-checkout-storage';
import { findCustomer } from '@/services/customerService';

export function useLoyalty() {
  const [points, setPoints] = useState(0);
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { customerInfo } = useCustomerInfoStorage();

  const fetchCustomerLoyaltyPoints = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (!customerInfo.phone && !customerInfo.email) {
        setPoints(0);
        setCustomerId(undefined);
        return;
      }

      // Find customer by phone or email
      const identifier = customerInfo.phone || customerInfo.email || '';
      const customer = await findCustomer(identifier);
      
      if (customer?.id) {
        setCustomerId(customer.id);
        const loyaltyPoints = await getLoyaltyPoints(customer.id);
        setPoints(loyaltyPoints);
      } else {
        setPoints(0);
        setCustomerId(undefined);
      }
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      setPoints(0);
    } finally {
      setIsLoading(false);
    }
  }, [customerInfo.phone, customerInfo.email]);

  // Redeem points and return success status
  const redeemPoints = useCallback(async (pointsToRedeem: number): Promise<boolean> => {
    if (!customerId) return false;
    
    try {
      const result = await redeemLoyaltyPoints(customerId, pointsToRedeem);
      if (result.success) {
        setPoints(result.remainingPoints);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error redeeming points:', error);
      return false;
    }
  }, [customerId]);

  // Update points from redemption
  const updatePoints = useCallback((newPoints: number) => {
    setPoints(newPoints);
  }, []);

  useEffect(() => {
    fetchCustomerLoyaltyPoints();
  }, [fetchCustomerLoyaltyPoints]);

  return {
    points,
    customerId,
    isLoading,
    updatePoints,
    redeemPoints,
    refreshPoints: fetchCustomerLoyaltyPoints
  };
}
