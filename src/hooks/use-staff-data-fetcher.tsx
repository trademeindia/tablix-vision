
import { useState, useEffect } from 'react';

interface UseFetcherOptions<T> {
  fetchFunction: (count: number) => T[];
  staffCount?: number;
}

export function useStaffDataFetcher<T>({ fetchFunction, staffCount = 10 }: UseFetcherOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use the demo data generator
    const fetchData = () => {
      setIsLoading(true);
      try {
        const fetchedData = fetchFunction(staffCount);
        setData(fetchedData);
        setError(null);
      } catch (err) {
        console.error('Error generating data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [staffCount, fetchFunction]);
  
  return {
    data,
    isLoading,
    error
  };
}
