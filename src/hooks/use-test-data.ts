
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useTestData(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const [usingTestData, setUsingTestData] = useState(true); // Changed to default to true
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);

  // Generate test data if needed
  useEffect(() => {
    // Always generate test data for demonstration purposes
    if (restaurantId && !testData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);
      
      toast({
        title: "Demo Mode",
        description: "You're viewing a demonstration. All features are fully functional!",
      });
    }
  }, [restaurantId, testData, queryClient]);

  return {
    usingTestData,
    setUsingTestData,
    testData,
    setTestData,
  };
}
