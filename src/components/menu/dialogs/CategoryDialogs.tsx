
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import CategoryForm from '@/components/menu/CategoryForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { createMenuCategory, updateMenuCategory, deleteMenuCategory } from '@/services/menu';

interface CategoryDialogsProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedCategory: MenuCategory | null;
  setSelectedCategory: (category: MenuCategory | null) => void;
  restaurantId: string;
}

const CategoryDialogs: React.FC<CategoryDialogsProps> = ({ 
  isAddOpen, 
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedCategory,
  setSelectedCategory,
  restaurantId
}) => {
  const queryClient = useQueryClient();
  
  const createCategoryMutation = useMutation({
    mutationFn: createMenuCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      setIsAddOpen(false);
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
      setIsEditOpen(false);
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
      setIsDeleteOpen(false);
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
  
  const handleAddCategory = async (data: Partial<MenuCategory>) => {
    createCategoryMutation.mutate({
      ...data,
      restaurant_id: restaurantId
    });
  };
  
  const handleUpdateCategory = async (data: Partial<MenuCategory>) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, updates: data });
    }
  };
  
  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
    }
  };
  
  return (
    <>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category 
              "{selectedCategory?.name}"{' '}
              {queryClient.getQueryData<MenuItem[]>(['menuItems'])?.filter(item => item.category_id === selectedCategory?.id).length > 0 && 
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
    </>
  );
};

export default CategoryDialogs;
