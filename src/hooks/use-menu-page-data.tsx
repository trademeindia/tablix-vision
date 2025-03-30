
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMenuCategories, fetchMenuItems, createMenuCategory } from '@/services/menuService';
import { MenuCategory, MenuItem } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

export const useMenuPageData = (restaurantId: string) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('items');
  
  // Category dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  
  // Item dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => fetchMenuCategories(restaurantId),
    retry: 2,
    staleTime: 30000 // 30 seconds
  });
  
  // Fetch menu items
  const { 
    data: menuItems = [], 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => fetchMenuItems(undefined, restaurantId),
    retry: 2,
    staleTime: 30000 // 30 seconds
  });

  // Auto-retry if there's an error fetching categories
  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      const timer = setTimeout(() => {
        refetchCategories();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [categoriesError, refetchCategories]);

  // Auto-retry if there's an error fetching items
  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      const timer = setTimeout(() => {
        refetchItems();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [itemsError, refetchItems]);
  
  // Function to refresh categories
  const handleRefreshCategories = async () => {
    try {
      await refetchCategories();
      toast({
        title: "Categories refreshed",
        description: `${categories.length} categories loaded.`,
      });
    } catch (error) {
      console.error("Error refreshing categories:", error);
      toast({
        title: "Failed to refresh categories",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  // Create a default category if none exists
  const handleCreateDefaultCategory = async () => {
    try {
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
    }
  };
  
  // Create a default category if none exists when categories load
  useEffect(() => {
    if (categories.length === 0 && !isCategoriesLoading && !categoriesError) {
      handleCreateDefaultCategory();
    }
  }, [categories, isCategoriesLoading, categoriesError]);

  // Category action handlers
  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };
  
  const handleDeleteCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };
  
  // Item action handlers
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditItemOpen(true);
  };
  
  const handleDeleteItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
  };
  
  const handleViewItem = (id: string) => {
    const item = menuItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsEditItemOpen(true);
    }
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Data and loading states
    categories,
    menuItems,
    isCategoriesLoading,
    isItemsLoading,
    categoriesError,
    itemsError,
    
    // Category dialog states
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    isDeleteCategoryOpen,
    setIsDeleteCategoryOpen,
    selectedCategory,
    setSelectedCategory,
    
    // Item dialog states
    isAddItemOpen,
    setIsAddItemOpen,
    isEditItemOpen,
    setIsEditItemOpen,
    isDeleteItemOpen,
    setIsDeleteItemOpen,
    selectedItem,
    setSelectedItem,
    
    // Functions
    handleRefreshCategories,
    handleEditCategory,
    handleDeleteCategoryClick,
    handleEditItem,
    handleDeleteItemClick,
    handleViewItem
  };
};
