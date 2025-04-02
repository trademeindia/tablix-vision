
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
    staleTime: 30000 // 30 seconds
  });
  
  // Use test data if there are errors with real data
  const categories: MenuCategory[] = (categoriesError || categoriesData.length === 0) && usingTestData 
    ? TEST_CATEGORIES 
    : categoriesData;

  // Auto-retry if there's an error fetching categories
  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      
      // Provide specific error guidance based on error type
      let errorTitle = "Could not load menu categories";
      let errorDescription = "Falling back to test data";
      
      if (categoriesError instanceof Error) {
        const errorMsg = categoriesError.message.toLowerCase();
        
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorTitle = "Network connection issue";
          errorDescription = "Check your internet connection and try again. Using test data for now.";
        } else if (errorMsg.includes('timeout')) {
          errorTitle = "Server response timeout";
          errorDescription = "The server is taking too long to respond. Using test data for now.";
        } else if (errorMsg.includes('permission') || errorMsg.includes('security policy')) {
          errorTitle = "Permission error";
          errorDescription = "You may not have permission to view this data. Using test data instead.";
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
      
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
