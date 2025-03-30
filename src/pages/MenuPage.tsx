
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMenuPageData } from '@/hooks/use-menu-page-data';
import PageHeader from '@/components/menu/PageHeader';
import MenuAlerts from '@/components/menu/MenuAlerts';
import MenuContent from '@/components/menu/MenuContent';
import CategoryDialogs from '@/components/menu/dialogs/CategoryDialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';

const MenuPage = () => {
  const restaurantId = "00000000-0000-0000-0000-000000000000";
  
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
    handleViewItem
  } = useMenuPageData(restaurantId);

  return (
    <DashboardLayout>
      <PageHeader 
        activeTab={activeTab}
        onRefresh={handleRefreshCategories}
        onAdd={() => activeTab === 'categories' ? setIsAddCategoryOpen(true) : setIsAddItemOpen(true)}
        isLoading={isCategoriesLoading}
      />
      
      <MenuAlerts 
        categoriesError={categoriesError}
        itemsError={itemsError}
        categoriesCount={categories.length}
        isCategoriesLoading={isCategoriesLoading}
        onAddCategory={() => setIsAddCategoryOpen(true)}
      />
      
      <MenuContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categories={categories}
        menuItems={menuItems}
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
        categories={categories}
        restaurantId={restaurantId}
        onRefreshCategories={handleRefreshCategories}
      />
    </DashboardLayout>
  );
};

export default MenuPage;
