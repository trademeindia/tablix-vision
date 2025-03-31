
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMenuCategories, fetchMenuItems, createMenuCategory } from '@/services/menuService';
import { MenuCategory, MenuItem } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

// Fallback test data for when the database connection fails
const TEST_CATEGORIES: MenuCategory[] = [
  {
    id: "test-cat-1",
    name: "Appetizers",
    description: "Start your meal right",
    display_order: 1
  },
  {
    id: "test-cat-2",
    name: "Main Course",
    description: "Delicious entrees",
    display_order: 2
  },
  {
    id: "test-cat-3",
    name: "Desserts",
    description: "Sweet treats",
    display_order: 3
  },
  {
    id: "test-cat-4",
    name: "Beverages",
    description: "Refreshing drinks",
    display_order: 4
  }
];

const TEST_MENU_ITEMS: MenuItem[] = [
  {
    id: "test-item-1",
    name: "Crispy Spring Rolls",
    description: "Vegetable filled crispy rolls served with sweet chili sauce",
    price: 8.99,
    category_id: "test-cat-1",
    image_url: "https://images.unsplash.com/photo-1677366767031-01c8255cb812?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      items: ["Wheat"]
    }
  },
  {
    id: "test-item-2",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet grilled to perfection, served with seasonal vegetables",
    price: 22.99,
    category_id: "test-cat-2",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      items: ["Fish"]
    }
  },
  {
    id: "test-item-3",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.99,
    category_id: "test-cat-3",
    image_url: "https://images.unsplash.com/photo-1617305855058-336d9ce3aae8?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      items: ["Dairy", "Eggs", "Wheat"]
    }
  },
  {
    id: "test-item-4",
    name: "Sparkling Water",
    description: "Refreshing sparkling water with a hint of lemon",
    price: 3.99,
    category_id: "test-cat-4",
    image_url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      items: []
    }
  }
];

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
  
  // State to track if we're using test data
  const [usingTestData, setUsingTestData] = useState(false);
  
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
  
  // Fetch menu items
  const { 
    data: menuItemsData = [], 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => fetchMenuItems(undefined, restaurantId),
    retry: 2,
    staleTime: 30000 // 30 seconds
  });

  // Use test data if there are errors with real data
  const categories = (categoriesError || categoriesData.length === 0) && usingTestData 
    ? TEST_CATEGORIES 
    : categoriesData;
    
  const menuItems = (itemsError || menuItemsData.length === 0) && usingTestData 
    ? TEST_MENU_ITEMS 
    : menuItemsData;

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
  }, [categoriesError, refetchCategories]);

  // Auto-retry if there's an error fetching items
  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      // Use test data after multiple retries
      setTimeout(() => {
        setUsingTestData(true);
      }, 5000);
      
      const timer = setTimeout(() => {
        refetchItems();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [itemsError, refetchItems]);
  
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
    handleViewItem,
    
    // Test data status
    usingTestData
  };
};
