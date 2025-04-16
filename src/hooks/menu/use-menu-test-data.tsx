
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useMenuTestData(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const [usingTestData, setUsingTestData] = useState(true);
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  const [toastShown, setToastShown] = useState(false);

  const hasToastBeenShown = useCallback(() => {
    return localStorage.getItem('customerMenuToastShown') === 'true';
  }, []);

  const generateAndUseTestData = useCallback(() => {
    if (restaurantId && !testData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      setUsingTestData(true);

      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);

      if (!toastShown && !hasToastBeenShown()) {
        toast({
          title: "Demo Mode",
          description: "You're viewing a demonstration with sample menu items.",
        });
        setToastShown(true);
        localStorage.setItem('customerMenuToastShown', 'true');
      }
    }
  }, [restaurantId, testData, queryClient, toastShown, hasToastBeenShown]);

  return {
    usingTestData,
    testData,
    generateAndUseTestData
  };
}
