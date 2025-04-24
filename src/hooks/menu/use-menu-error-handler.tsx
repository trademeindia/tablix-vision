
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export function useMenuErrorHandler(
  error: Error | null,
  restaurantId: string | null,
  refetchCategories: () => Promise<void>
) {
  useEffect(() => {
    if (error && restaurantId) {
      console.error("Error fetching menu data:", error);
      toast({
        title: "Could not load menu",
        description: "Trying again...",
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        refetchCategories();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refetchCategories, restaurantId]);
}
