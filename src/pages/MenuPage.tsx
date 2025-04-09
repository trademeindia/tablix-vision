
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMenuPageData } from '@/hooks/menu/use-menu-page-data';
import MenuContent from '@/components/menu/MenuContent';
import { useRefreshMenuData } from '@/hooks/menu/use-refresh-menu-data';
import { useDialogAutoRefresh } from '@/hooks/menu/use-dialog-auto-refresh';
import { useMenuDialogEvents } from '@/hooks/menu/use-menu-dialog-events';
import PageHeaderContainer from '@/components/menu/PageHeaderContainer';
import MenuAlertsContainer from '@/components/menu/MenuAlertsContainer';
import MenuDialogsContainer from '@/components/menu/MenuDialogsContainer';

const MenuPage = () => {
  // Use a state for restaurant ID in case we want to make it dynamic in the future
  const [restaurantId] = useState("00000000-0000-0000-0000-000000000000");
  
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
    usingTestData,
    setUsingTestData
  } = useMenuPageData(restaurantId);

  // Use the refresh hook
  const { handleRefreshAll, isRefreshing } = useRefreshMenuData(
    restaurantId,
    handleRefreshCategories
  );

  // Use the dialog auto refresh hook
  useDialogAutoRefresh({
    isAddItemOpen,
    isEditItemOpen,
    isDeleteItemOpen,
    isAddCategoryOpen,
    isEditCategoryOpen,
    isDeleteCategoryOpen,
    onRefresh: handleRefreshAll
  });

  // Use the menu dialog events hook
  useMenuDialogEvents({
    setIsAddCategoryOpen,
    setIsAddItemOpen
  });

  // Also refresh when component mounts
  useEffect(() => {
    console.log("Menu page mounted, doing initial data fetch");
    
    // Try to use real data first
    if (usingTestData) {
      setUsingTestData(false);
    }
    
    const initialLoadTimeout = setTimeout(() => {
      handleRefreshAll();
    }, 300); // slight delay for better UI experience
    
    return () => clearTimeout(initialLoadTimeout);
  }, [handleRefreshAll, usingTestData, setUsingTestData]);

  // Defensive rendering to ensure the page loads even if some data is missing
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeaderContainer 
          activeTab={activeTab}
          onRefresh={handleRefreshAll}
          isLoading={isCategoriesLoading || isItemsLoading || isRefreshing.current}
        />
        
        <MenuAlertsContainer 
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
        
        <MenuDialogsContainer 
          isAddCategoryOpen={isAddCategoryOpen}
          setIsAddCategoryOpen={setIsAddCategoryOpen}
          isEditCategoryOpen={isEditCategoryOpen}
          setIsEditCategoryOpen={setIsEditCategoryOpen}
          isDeleteCategoryOpen={isDeleteCategoryOpen}
          setIsDeleteCategoryOpen={setIsDeleteCategoryOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          
          isAddItemOpen={isAddItemOpen}
          setIsAddItemOpen={setIsAddItemOpen}
          isEditItemOpen={isEditItemOpen}
          setIsEditItemOpen={setIsEditItemOpen}
          isDeleteItemOpen={isDeleteItemOpen}
          setIsDeleteItemOpen={setIsDeleteItemOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          
          categories={categories || []}
          restaurantId={restaurantId}
          onRefreshData={handleRefreshAll}
          usingTestData={usingTestData}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
