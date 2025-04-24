
import { toast } from '@/hooks/use-toast';

/**
 * Validates table number input for QR code generation
 * @param tableNumber The table number to validate
 * @returns Boolean indicating if the table number is valid
 */
export const validateTableNumber = (tableNumber: string): boolean => {
  if (!tableNumber.trim() || isNaN(Number(tableNumber)) || Number(tableNumber) <= 0) {
    toast({
      title: "Invalid Table Number",
      description: "Please enter a valid table number",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

/**
 * Validates seats input for QR code generation
 * @param seats The number of seats to validate
 * @returns Boolean indicating if the seats number is valid
 */
export const validateSeats = (seats: string): boolean => {
  if (!seats.trim() || isNaN(Number(seats)) || Number(seats) <= 0) {
    toast({
      title: "Invalid Seats Number",
      description: "Please enter a valid number of seats",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

/**
 * Validates restaurant ID for QR code generation
 * @param restaurantId The restaurant ID to validate
 * @returns Boolean indicating if the restaurant ID is valid
 */
export const validateRestaurantId = (restaurantId: string): boolean => {
  if (!restaurantId || restaurantId === '00000000-0000-0000-0000-000000000000') {
    toast({
      title: "Missing Restaurant",
      description: "You need to create a restaurant first to generate real QR codes",
      variant: "destructive",
    });
    return false;
  }
  return true;
};
