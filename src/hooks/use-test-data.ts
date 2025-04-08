
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useTestData(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const [usingTestData, setUsingTestData] = useState(true); // Default to true
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  const [toastShown, setToastShown] = useState(false); // Track if toast has been shown

  // Generate test data if needed
  useEffect(() => {
    // Always generate test data for demonstration purposes
    if (restaurantId && !testData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);
      
      // Only show toast if it hasn't been shown yet in this session
      if (!toastShown) {
        toast({
          title: "Demo Mode",
          description: "You're viewing a demonstration. All features are fully functional!",
        });
        setToastShown(true);
      }
    }
  }, [restaurantId, testData, queryClient, toastShown]);

  return {
    usingTestData,
    setUsingTestData,
    testData,
    setTestData,
  };
}
