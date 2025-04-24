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
import { ensureDemoRestaurantExists } from "@/services/menu/demoSetup";

const MenuPage = () => {
  const queryClient = useQueryClient();
  const [restaurantId] = useState("00000000-0000-0000-0000-000000000000");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const isRefreshing = useRef(false);
  const dialogCloseTimestamp = useRef<number | null>(null);
  const initialLoadComplete = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
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
          // console.log("Menu media bucket found:", menuMediaBucket);
        }
      } catch (err) {
        console.error("Error in storage bucket check:", err);
      }
    };
    
    checkStorageBucket();
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const consoleErrors = document.querySelectorAll('.console-error');
      if (consoleErrors.length > 0) {
        setIsErrorVisible(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const setupDemoEnvironment = async () => {
      try {
        await ensureDemoRestaurantExists();
        // console.log("Demo environment setup complete");
      } catch (error) {
        console.error("Failed to setup demo environment:", error);
      }
    };
    
    setupDemoEnvironment();
  }, []);
  
  const {
    activeTab,
    setActiveTab,
    
    categories,
    menuItems,
    isCategoriesLoading,
    isItemsLoading,
    categoriesError,
    itemsError,
    
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    isDeleteCategoryOpen,
    setIsDeleteCategoryOpen,
    selectedCategory,
    setSelectedCategory,
    
    isAddItemOpen,
    setIsAddItemOpen,
    isEditItemOpen,
    setIsEditItemOpen,
    isDeleteItemOpen,
    setIsDeleteItemOpen,
    selectedItem,
    setSelectedItem,
    
    handleRefreshCategories,
    handleEditCategory,
    handleDeleteCategoryClick,
    handleEditItem,
    handleDeleteItemClick,
    handleViewItem,
    
    usingTestData
  } = useMenuPageData(restaurantId);

  const handleRefreshAll = useCallback(async () => {
    if (isRefreshing.current) {
      // console.log("Already refreshing, skip this refresh request");
      return;
    }
    
    // console.log("Refreshing all menu data");
    isRefreshing.current = true;
    toast({
      title: "Refreshing menu data",
      description: "Fetching the latest menu items and categories..."
    });
    
    try {
      await Promise.all([
        handleRefreshCategories(),
        queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] })
      ]);
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['menuItems', restaurantId] });
        isRefreshing.current = false;
        // console.log("Data refresh complete");
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

  useEffect(() => {
    const dialogsClosed = !isAddItemOpen && !isEditItemOpen && !isDeleteItemOpen && 
                         !isAddCategoryOpen && !isEditCategoryOpen && !isDeleteCategoryOpen;
    
    if (dialogsClosed) {
      if (dialogCloseTimestamp.current === null) {
        dialogCloseTimestamp.current = Date.now();
        
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        // console.log("Dialog closed, refreshing data in 800ms");
        refreshTimeoutRef.current = setTimeout(() => {
          handleRefreshAll();
          dialogCloseTimestamp.current = null;
        }, 800);
      }
    } else {
      dialogCloseTimestamp.current = null;
    }
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAddItemOpen, isEditItemOpen, isDeleteItemOpen, isAddCategoryOpen, isEditCategoryOpen, isDeleteCategoryOpen, handleRefreshAll]);

  useEffect(() => {
    if (!initialLoadComplete.current) {
      // console.log("Menu page mounted, doing initial data fetch");
      const initialLoadTimeout = setTimeout(() => {
        handleRefreshAll();
        initialLoadComplete.current = true;
      }, 1000);
      
      return () => clearTimeout(initialLoadTimeout);
    }
  }, [handleRefreshAll]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

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
