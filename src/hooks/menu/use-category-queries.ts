
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuCategories, createMenuCategory } from '@/services/menuService';
import { MenuCategory } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { TEST_CATEGORIES } from './test-data';

export const useCategoryQueries = (
  restaurantId: string,
  usingTestData: boolean,
  setUsingTestData: (value: boolean) => void
) => {
  // Fetch categories
  const { 
    data: categoriesData = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => fetchMenuCategories(restaurantId),
    retry: 2,
    staleTime: 30000 // 30 seconds
  });
  
  // Use test data if there are errors with real data
  const categories = (categoriesError || categoriesData.length === 0) && usingTestData 
    ? TEST_CATEGORIES 
    : categoriesData;

  // Auto-retry if there's an error fetching categories
  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      // Use test data after multiple retries
      setTimeout(() => {
        setUsingTestData(true);
      }, 5000);
      
      const timer = setTimeout(() => {
        refetchCategories();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [categoriesError, refetchCategories, setUsingTestData]);
  
  // Function to refresh categories
  const handleRefreshCategories = async () => {
    try {
      if (usingTestData) {
        toast({
          title: "Using test data",
          description: "Currently displaying test data due to database connection issues.",
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
      toast({
        title: "Failed to refresh categories",
        description: "Using test data instead.",
        variant: "destructive",
      });
      setUsingTestData(true);
    }
  };
  
  // Create a default category if none exists
  const handleCreateDefaultCategory = async () => {
    try {
      if (usingTestData) {
        // Don't try to create categories in test mode
        return;
      }
      
      if (categories.length === 0) {
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
      }
    } catch (error) {
      console.error("Error creating default category:", error);
      setUsingTestData(true);
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
