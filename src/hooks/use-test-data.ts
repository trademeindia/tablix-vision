
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useTestData(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const [usingTestData, setUsingTestData] = useState(true); // Default to true
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  
  // Check localStorage for toast shown status
  const [toastShown, setToastShown] = useState(() => {
    return localStorage.getItem('demoToastShown') === 'true';
  });

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
        // Set localStorage flag to prevent showing toast again
        localStorage.setItem('demoToastShown', 'true');
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
