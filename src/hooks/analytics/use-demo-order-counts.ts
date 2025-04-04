
import { useState, useEffect } from 'react';

export function useDemoOrderCounts() {
  const [orderCounts, setOrderCounts] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    pending: 0,
    isLoading: true
  });

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setOrderCounts({
        today: 36,
        week: 187,
        month: 752,
        year: 9452,
        pending: 18,
        isLoading: false
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return orderCounts;
}
