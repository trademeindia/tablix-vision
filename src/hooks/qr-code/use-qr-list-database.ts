
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type TableWithQR = {
  id: string;
  number: number;
  qr_code_url: string;
  status: string;
  created_at: string;
  seats: number;
};

/**
 * Hook for QR code table list database operations
 * @param restaurantId The restaurant ID for which QR codes are being managed
 */
export function useQRListDatabase(restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches all tables with QR codes for a restaurant
   */
  const fetchTables = async (): Promise<TableWithQR[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('number', { ascending: true });
      
      if (error) {
        console.error('Error fetching tables:', error);
        toast({
          title: 'Failed to load QR codes',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data as TableWithQR[];
    } catch (error) {
      console.error('Error in fetchTables:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a table and its associated QR code
   * @param tableId The ID of the table to delete
   * @returns Promise that resolves to boolean indicating success
   */
  const deleteTable = async (tableId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId);
      
      if (error) {
        console.error('Error deleting table:', error);
        toast({
          title: 'Failed to delete QR code',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'QR Code Deleted',
        description: 'The QR code has been removed successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error in deleteTable:', error);
      return false;
    }
  };

  return {
    isLoading,
    fetchTables,
    deleteTable
  };
}
