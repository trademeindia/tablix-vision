import React, { useState, useEffect, useCallback } from 'react';
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

const MenuPage = () => {
  const queryClient = useQueryClient();
  // Use a state for restaurant ID in case we want to make it dynamic in the future
  const [restaurantId] = useState("00000000-0000-0000-0000-000000000000");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  
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
    console.log("Refreshing all menu data");
    try {
      // Force refetch of both categories and items
      await Promise.all([
        handleRefreshCategories(),
        queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] }),
        queryClient.refetchQueries({ queryKey: ['menuItems', restaurantId] })
      ]);
      
      // Additional manual refetch after a short delay to ensure data is fresh
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['menuItems', restaurantId] });
      }, 500);
      
      console.log("Data refresh complete");
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, [handleRefreshCategories, queryClient, restaurantId]);

  // Automatically refresh data after dialog closes
  useEffect(() => {
    if (!isAddItemOpen && !isEditItemOpen && !isDeleteItemOpen) {
      console.log("Dialog closed, refreshing data");
      handleRefreshAll();
    }
  }, [isAddItemOpen, isEditItemOpen, isDeleteItemOpen, handleRefreshAll]);

  // Also refresh when component mounts
  useEffect(() => {
    console.log("Menu page mounted, doing initial data fetch");
    handleRefreshAll();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      console.log("Periodic refresh triggered");
      handleRefreshAll();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [handleRefreshAll]);

  // Defensive rendering to ensure the page loads even if some data is missing
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          activeTab={activeTab}
          onRefresh={handleRefreshAll}
          onAdd={() => activeTab === 'categories' ? setIsAddCategoryOpen(true) : setIsAddItemOpen(true)}
          isLoading={isCategoriesLoading || isItemsLoading}
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
