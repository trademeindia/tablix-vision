
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for QR code database operations
 * @param restaurantId The restaurant ID for which QR codes are being managed
 */
export function useQRDatabase(restaurantId: string) {
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Saves or updates a QR code in the database
   * @param tableNumber The table number
   * @param qrValue The URL encoded in the QR code
   * @param seats The number of seats at the table
   */
  const saveQRCodeToDatabase = async (
    tableNumber: string,
    qrValue: string,
    seats: string
  ): Promise<boolean> => {
    if (!qrValue) return false;
    
    try {
      setIsSaving(true);
      
      // Check if table with this number already exists for this restaurant
      const { data: existingTables, error: checkError } = await supabase
        .from('tables')
        .select('id')
        .eq('restaurant_id', restaurantId)
        .eq('number', parseInt(tableNumber))
        .limit(1);
        
      if (checkError) {
        console.error("Error checking for existing table:", checkError);
        throw new Error(checkError.message);
      }
      
      let result;
      if (existingTables && existingTables.length > 0) {
        // Update existing table
        result = await supabase
          .from('tables')
          .update({
            qr_code_url: qrValue,
            seats: parseInt(seats),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTables[0].id)
          .select();
          
        toast({
          title: "QR Code Updated",
          description: `QR code for Table ${tableNumber} has been updated.`,
        });
      } else {
        // Insert new table
        result = await supabase
          .from('tables')
          .insert({
            restaurant_id: restaurantId,
            number: parseInt(tableNumber),
            qr_code_url: qrValue,
            seats: parseInt(seats),
            status: 'available',
          })
          .select();
          
        toast({
          title: "QR Code Generated",
          description: `QR code for Table ${tableNumber} has been generated.`,
        });
      }
      
      if (result.error) {
        console.error("Error saving QR code to database:", result.error);
        throw new Error(result.error.message);
      }
        
      console.log("QR code saved to database:", result.data);
      return true;
    } catch (err) {
      console.error("Error in database operation:", err);
      toast({
        title: "Database Error",
        description: err instanceof Error ? err.message : "Failed to save QR code to database",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveQRCodeToDatabase
  };
}
