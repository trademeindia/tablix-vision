
import { useState, useEffect } from 'react';
import { getPopularItems } from '@/services/analyticsService';

export function usePopularItems(restaurantId: string | undefined) {
  const [popularItems, setPopularItems] = useState<Array<{name: string, count: number}>>([]);
  const [popularItemsLoading, setPopularItemsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setPopularItemsLoading(true);
        const items = await getPopularItems(restaurantId || '');
        setPopularItems(items);
      } catch (error) {
        console.error('Error fetching popular items:', error);
        setPopularItems([
          { name: 'Margherita Pizza', count: 42 },
          { name: 'Chicken Alfredo', count: 36 },
          { name: 'Caesar Salad', count: 28 },
          { name: 'Cheeseburger', count: 25 },
          { name: 'Chocolate Cake', count: 19 }
        ]);
      } finally {
        setPopularItemsLoading(false);
      }
    };

    fetchPopularItems();
  }, [restaurantId]);

  return { popularItems, popularItemsLoading };
}
