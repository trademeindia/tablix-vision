
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useTestData(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const [usingTestData, setUsingTestData] = useState(false);
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);

  // Generate test data if needed
  useEffect(() => {
    // If there's an error or no data, generate test data
    if (restaurantId && !testData && usingTestData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);
      
      toast({
        title: "Using Demo Data",
        description: "We're showing example menu items for demonstration purposes.",
      });
    }
  }, [restaurantId, testData, usingTestData, queryClient]);

  return {
    usingTestData,
    setUsingTestData,
    testData,
    setTestData,
  };
}
