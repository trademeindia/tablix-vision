
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMenuPageData } from '@/hooks/menu/use-menu-page-data';
import PageHeader from '@/components/menu/PageHeader';
import MenuAlerts from '@/components/menu/MenuAlerts';
import MenuContent from '@/components/menu/MenuContent';
import CategoryDialogs from '@/components/menu/dialogs/CategoryDialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const MenuPage = () => {
  // Use a state for restaurant ID in case we want to make it dynamic in the future
  const [restaurantId] = useState("00000000-0000-0000-0000-000000000000");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { isAuthenticated, checkSession } = useAuth();
  
  // Verify auth status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        console.log("User is authenticated, verifying session");
        await checkSession();
      } else {
        console.log("User not authenticated in MenuPage");
      }
    };
    
    verifyAuth();
  }, [isAuthenticated, checkSession]);
  
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
    usingTestData,
    setUsingTestData
  } = useMenuPageData(restaurantId);

  // Function to handle auth verification and refresh
  const handleVerifyAndRefresh = async () => {
    try {
      await checkSession();
      handleRefreshCategories();
    } catch (err) {
      console.error("Error during verification and refresh:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          activeTab={activeTab}
          onRefresh={handleRefreshCategories}
          onAdd={() => activeTab === 'categories' ? setIsAddCategoryOpen(true) : setIsAddItemOpen(true)}
          isLoading={isCategoriesLoading}
        />
        
        {isErrorVisible && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Issue</AlertTitle>
            <AlertDescription className="mt-2">
              <p>There appears to be a database connection issue. This might be caused by:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Authentication session expired</li>
                <li>Network connectivity issues</li>
                <li>Supabase configuration problems</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleVerifyAndRefresh}>
                  Verify Auth & Refresh
                </Button>
                <Button 
                  variant={usingTestData ? "default" : "outline"} 
                  onClick={() => setUsingTestData(!usingTestData)}
                >
                  {usingTestData ? "Using Test Data" : "Use Test Data Instead"}
                </Button>
              </div>
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
          onRefreshCategories={handleRefreshCategories}
          usingTestData={usingTestData}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
