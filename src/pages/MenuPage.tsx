
import React, { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMenuPageData } from '@/hooks/menu/use-menu-page-data';
import PageHeader from '@/components/menu/PageHeader';
import MenuAlerts from '@/components/menu/MenuAlerts';
import MenuContent from '@/components/menu/MenuContent';
import CategoryDialogs from '@/components/menu/dialogs/CategoryDialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';
import MenuInfoCard from '@/components/menu/MenuInfoCard';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MenuPage = () => {
  const queryClient = useQueryClient();
  // Use a state for restaurant ID in case we want to make it dynamic in the future
  const [restaurantId] = useState("00000000-0000-0000-0000-000000000000");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const isRefreshing = useRef(false);
  const dialogCloseTimestamp = useRef<number | null>(null);
  const initialLoadComplete = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initialize storage bucket check
    const checkStorageBucket = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking storage buckets:", error);
          return;
        }
        
        const menuMediaBucket = buckets.find(b => b.name === 'menu-media');
        
        if (!menuMediaBucket) {
          console.warn("Menu media bucket not found. Please set up storage bucket.");
        } else {
          console.log("Menu media bucket found:", menuMediaBucket);
        }
      } catch (err) {
        console.error("Error in storage bucket check:", err);
      }
    };
    
    checkStorageBucket();
  }, []);
  
  useEffect(() => {
    // Check for database errors and show a helpful message after a short delay
    const timer = setTimeout(() => {
      const consoleErrors = document.querySelectorAll('.console-error');
      if (consoleErrors.length > 0) {
        setIsErrorVisible(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const {
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
  } = useMenuPageData(restaurantId);

  // Enhanced refresh function that ensures both categories and items are refreshed
  const handleRefreshAll = useCallback(async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing.current) {
      console.log("Already refreshing, skip this refresh request");
      return;
    }
    
    console.log("Refreshing all menu data");
    isRefreshing.current = true;
    toast({
      title: "Refreshing menu data",
      description: "Fetching the latest menu items and categories..."
    });
    
    try {
      // Force refetch of both categories and items
      await Promise.all([
        handleRefreshCategories(),
        queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] })
      ]);
      
      // Additional manual refetch after a short delay to ensure data is fresh
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['menuItems', restaurantId] });
        isRefreshing.current = false;
        console.log("Data refresh complete");
        toast({
          title: "Menu data refreshed",
          description: `Found ${menuItems.length} items and ${categories?.length || 0} categories`
        });
      }, 800);
    } catch (error) {
      console.error("Error refreshing data:", error);
      isRefreshing.current = false;
      toast({
        title: "Error refreshing data",
        description: "There was a problem refreshing the menu data",
        variant: "destructive"
      });
    }
  }, [handleRefreshCategories, queryClient, restaurantId, menuItems.length, categories?.length]);

  // Automatically refresh data after dialog closes, but prevent excessive refreshes
  useEffect(() => {
    // Only refresh when a dialog has just been closed
    const dialogsClosed = !isAddItemOpen && !isEditItemOpen && !isDeleteItemOpen && 
                         !isAddCategoryOpen && !isEditCategoryOpen && !isDeleteCategoryOpen;
    
    if (dialogsClosed) {
      // Set close timestamp when a dialog closes
      if (dialogCloseTimestamp.current === null) {
        dialogCloseTimestamp.current = Date.now();
        
        // Clear any existing timeout
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        console.log("Dialog closed, refreshing data in 800ms");
        // Use setTimeout to prevent excessive refreshing
        refreshTimeoutRef.current = setTimeout(() => {
          handleRefreshAll();
          dialogCloseTimestamp.current = null;
        }, 800);
      }
    } else {
      // Reset timestamp when dialog is open
      dialogCloseTimestamp.current = null;
    }
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAddItemOpen, isEditItemOpen, isDeleteItemOpen, isAddCategoryOpen, isEditCategoryOpen, isDeleteCategoryOpen, handleRefreshAll]);

  // Only refresh once when component mounts
  useEffect(() => {
    if (!initialLoadComplete.current) {
      console.log("Menu page mounted, doing initial data fetch");
      const initialLoadTimeout = setTimeout(() => {
        handleRefreshAll();
        initialLoadComplete.current = true;
      }, 1000); // slight delay for better UI experience
      
      return () => clearTimeout(initialLoadTimeout);
    }
  }, [handleRefreshAll]);

  // Cleanup all timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Defensive rendering to ensure the page loads even if some data is missing
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          activeTab={activeTab}
          onRefresh={handleRefreshAll}
          onAdd={() => activeTab === 'categories' ? setIsAddCategoryOpen(true) : setIsAddItemOpen(true)}
          isLoading={isCategoriesLoading || isItemsLoading || isRefreshing.current}
        />
        
        <MenuInfoCard showModel3dInfo={true} />
        
        {isErrorVisible && (
          <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              You're in demo mode. Add and edit menu items to see how everything works! All features are fully operational.
            </AlertDescription>
          </Alert>
        )}
        
        <MenuAlerts 
          categoriesError={categoriesError}
          itemsError={itemsError}
          categoriesCount={categories?.length || 0}
          isCategoriesLoading={isCategoriesLoading}
          onAddCategory={() => setIsAddCategoryOpen(true)}
        />
        
        <MenuContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={categories || []}
          menuItems={menuItems || []}
          isCategoriesLoading={isCategoriesLoading}
          isItemsLoading={isItemsLoading}
          onAddItem={() => setIsAddItemOpen(true)}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItemClick}
          onAddCategory={() => setIsAddCategoryOpen(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategoryClick}
        />
        
        <CategoryDialogs 
          isAddOpen={isAddCategoryOpen}
          setIsAddOpen={setIsAddCategoryOpen}
          isEditOpen={isEditCategoryOpen}
          setIsEditOpen={setIsEditCategoryOpen}
          isDeleteOpen={isDeleteCategoryOpen}
          setIsDeleteOpen={setIsDeleteCategoryOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          restaurantId={restaurantId}
        />
        
        <ItemDialogs 
          isAddOpen={isAddItemOpen}
          setIsAddOpen={setIsAddItemOpen}
          isEditOpen={isEditItemOpen}
          setIsEditOpen={setIsEditItemOpen}
          isDeleteOpen={isDeleteItemOpen}
          setIsDeleteOpen={setIsDeleteItemOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          categories={categories || []}
          restaurantId={restaurantId}
          onRefreshCategories={handleRefreshAll}
          usingTestData={usingTestData}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
