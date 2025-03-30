import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchMenuCategories, fetchMenuItems } from '@/services/menuService';
import { MenuCategory, MenuItem } from '@/types/menu';
import MenuCategoriesTab from '@/components/menu/tabs/MenuCategoriesTab';
import MenuItemsTab from '@/components/menu/tabs/MenuItemsTab';
import CategoryDialogs from '@/components/menu/dialogs/CategoryDialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';
import Spinner from '@/components/ui/spinner';

const MenuPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('items');
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const restaurantId = "00000000-0000-0000-0000-000000000000";
  
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

  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      const timer = setTimeout(() => {
        refetchCategories();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [categoriesError, refetchCategories]);

  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      const timer = setTimeout(() => {
        refetchItems();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [itemsError, refetchItems]);
  
  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };
  
  const handleDeleteCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };
  
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

  const renderContent = () => {
    if (isCategoriesLoading || isItemsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      );
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <MenuItemsTab 
            items={menuItems} 
            categories={categories}
            isLoading={isItemsLoading}
            onAddItem={() => setIsAddItemOpen(true)}
            onViewItem={handleViewItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItemClick}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <MenuCategoriesTab 
            categories={categories} 
            menuItems={menuItems}
            isLoading={isCategoriesLoading}
            onAddCategory={() => setIsAddCategoryOpen(true)}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategoryClick}
          />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-slate-500">Manage your restaurant's menu items and categories</p>
        </div>
        
        <Button onClick={() => activeTab === 'categories' ? setIsAddCategoryOpen(true) : setIsAddItemOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === 'categories' ? 'Add Category' : 'Add Menu Item'}
        </Button>
      </div>
      
      {(categoriesError || itemsError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {categoriesError ? 'Failed to load categories' : 'Failed to load menu items'}. The application will automatically retry.
          </AlertDescription>
        </Alert>
      )}
      
      {renderContent()}
      
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
      />
    </DashboardLayout>
  );
};

export default MenuPage;
