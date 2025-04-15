
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuCategories, createMenuCategory } from '@/services/menu';
import { MenuCategory } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { TEST_CATEGORIES } from './test-data';

export const useCategoryQueries = (
  restaurantId: string,
  usingTestData: boolean,
  setUsingTestData: (value: boolean) => void
) => {
  // Fetch categories with proper type definitions
  const { 
    data: categoriesData = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['menuCategories', restaurantId],
    queryFn: async () => {
      try {
        return await fetchMenuCategories(restaurantId);
      } catch (error) {
        console.error("Error in fetchMenuCategories:", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
    enabled: !usingTestData, // Only run query if not using test data
  });
  
  // Use test data as the primary source for demonstration
  const categories: MenuCategory[] = usingTestData
    ? TEST_CATEGORIES 
    : categoriesData;

  // Function to refresh categories
  const handleRefreshCategories = async () => {
    try {
      if (usingTestData) {
        toast({
          title: "Demo Mode Active",
          description: "You're using demonstration data. All features work as they would with real data.",
        });
        return;
      }
      
      await refetchCategories();
      toast({
        title: "Categories refreshed",
        description: `${categories.length} categories loaded.`,
      });
    } catch (error) {
      console.error("Error refreshing categories:", error);
      setUsingTestData(true);
      toast({
        title: "Using demonstration data",
        description: "Try all features without a database connection!",
      });
    }
  };
  
  // Create a default category if none exists
  const handleCreateDefaultCategory = async () => {
    if (categories.length === 0) {
      if (usingTestData) {
        const testData = TEST_CATEGORIES[0];
        // No need to create in database, just update the cache
        return;
      }
      
      try {
        await createMenuCategory({
          name: "General",
          description: "Default category for menu items",
          display_order: 0,
          restaurant_id: restaurantId
        });
        await refetchCategories();
        toast({
          title: "Default category created",
          description: "A 'General' category has been created for you.",
        });
      } catch (error) {
        console.error("Error creating default category:", error);
        setUsingTestData(true);
      }
    }
  };
  
  // Create a default category if none exists when categories load
  useEffect(() => {
    if (categories.length === 0 && !isCategoriesLoading && !categoriesError) {
      handleCreateDefaultCategory();
    }
  }, [categories, isCategoriesLoading, categoriesError]);

  return {
    categories,
    isCategoriesLoading,
    categoriesError,
    handleRefreshCategories,
    handleCreateDefaultCategory
  };
};
