import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';
import MenuItemCard from '@/components/menu/MenuItemCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import CategoryForm from '@/components/menu/CategoryForm';
import ItemForm from '@/components/menu/ItemForm';
import {
  fetchMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '@/services/menuService';
import { MenuCategory, MenuItem, MenuItemAllergens } from '@/types/menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError 
  } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => fetchMenuCategories(),
  });
  
  const { 
    data: menuItems = [], 
    isLoading: isItemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => fetchMenuItems(),
  });
  
  const createCategoryMutation = useMutation({
    mutationFn: createMenuCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      setIsAddCategoryOpen(false);
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create category",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuCategory> }) => 
      updateMenuCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      setIsEditCategoryOpen(false);
      setSelectedCategory(null);
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update category",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteMenuCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      setIsDeleteCategoryOpen(false);
      setSelectedCategory(null);
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const createItemMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsAddItemOpen(false);
      toast({
        title: "Item created",
        description: "The menu item has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => 
      updateMenuItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsEditItemOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item updated",
        description: "The menu item has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsDeleteItemOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item deleted",
        description: "The menu item has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleAddCategory = async (data: Partial<MenuCategory>) => {
    createCategoryMutation.mutate(data);
  };
  
  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };
  
  const handleUpdateCategory = async (data: Partial<MenuCategory>) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, updates: data });
    }
  };
  
  const handleDeleteCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };
  
  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
    }
  };
  
  const handleAddItem = async (data: Partial<MenuItem>) => {
    createItemMutation.mutate(data);
  };
  
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditItemOpen(true);
  };
  
  const handleUpdateItem = async (data: Partial<MenuItem>) => {
    if (selectedItem) {
      updateItemMutation.mutate({ id: selectedItem.id, updates: data });
    }
  };
  
  const handleDeleteItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
  };
  
  const handleDeleteItem = async () => {
    if (selectedItem) {
      deleteItemMutation.mutate(selectedItem.id);
    }
  };
  
  const handleViewItem = (id: string) => {
    const item = menuItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsEditItemOpen(true);
    }
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
            {categoriesError ? 'Failed to load categories' : 'Failed to load menu items'}. Please try again.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          {isItemsLoading ? (
            <div className="text-center py-10">Loading menu items...</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 mb-4">No menu items found</p>
              <Button onClick={() => setIsAddItemOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Menu Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                const allergens = item.allergens as MenuItemAllergens || {};
                
                return (
                  <MenuItemCard 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    category={
                      categories.find(cat => cat.id === item.category_id)?.name || 'Uncategorized'
                    }
                    image={item.image_url || ''}
                    isVegetarian={allergens?.isVegetarian}
                    isVegan={allergens?.isVegan}
                    isGlutenFree={allergens?.isGlutenFree}
                    onView={() => handleViewItem(item.id)}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItemClick(item)}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          {isCategoriesLoading ? (
            <div className="text-center py-10">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 mb-4">No categories found</p>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const itemCount = menuItems.filter(item => item.category_id === category.id).length;
                return (
                  <MenuCategoryCard 
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    itemCount={itemCount}
                    onEdit={() => handleEditCategory(category)}
                    onDelete={() => handleDeleteCategoryClick(category)}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your menu items.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            onSubmit={handleAddCategory}
            isSubmitting={createCategoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update this category's information.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm 
              initialData={selectedCategory}
              onSubmit={handleUpdateCategory}
              isSubmitting={updateCategoryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category 
              "{selectedCategory?.name}"{' '}
              {menuItems.filter(item => item.category_id === selectedCategory?.id).length > 0 && 
                'and remove the category from all associated menu items. The items themselves will not be deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Create a new item for your menu.
            </DialogDescription>
          </DialogHeader>
          <ItemForm 
            categories={categories}
            onSubmit={handleAddItem}
            isSubmitting={createItemMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update this menu item's information.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <ItemForm 
              categories={categories}
              initialData={selectedItem}
              onSubmit={handleUpdateItem}
              isSubmitting={updateItemMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteItemOpen} onOpenChange={setIsDeleteItemOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu item "{selectedItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MenuPage;
