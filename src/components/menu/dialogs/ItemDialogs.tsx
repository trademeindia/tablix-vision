
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
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

interface ItemDialogsProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  categories: MenuCategory[];
  restaurantId: string;
}

const ItemDialogs: React.FC<ItemDialogsProps> = ({ 
  isAddOpen, 
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedItem,
  setSelectedItem,
  categories,
  restaurantId
}) => {
  const queryClient = useQueryClient();
  
  const createItemMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsAddOpen(false);
      toast({
        title: "Item created",
        description: "The menu item has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Create item error:", error);
      toast({
        title: "Failed to create item",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => 
      updateMenuItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsEditOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item updated",
        description: "The menu item has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Update item error:", error);
      toast({
        title: "Failed to update item",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setIsDeleteOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item deleted",
        description: "The menu item has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Delete item error:", error);
      toast({
        title: "Failed to delete item",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });
  
  const handleAddItem = async (data: Partial<MenuItem>) => {
    createItemMutation.mutate({
      ...data,
      restaurant_id: restaurantId
    });
  };
  
  const handleUpdateItem = async (data: Partial<MenuItem>) => {
    if (selectedItem) {
      updateItemMutation.mutate({ id: selectedItem.id, updates: data });
    }
  };
  
  const handleDeleteItem = async () => {
    if (selectedItem) {
      deleteItemMutation.mutate(selectedItem.id);
    }
  };
  
  return (
    <>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Create a new item for your menu.
            </DialogDescription>
          </DialogHeader>
          {/* Wrap the form in a div with `position: relative` to create a new stacking context */}
          <div className="relative">
            <ItemForm 
              categories={categories}
              onSubmit={handleAddItem}
              isSubmitting={createItemMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) setSelectedItem(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update this menu item's information.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="relative">
              <ItemForm 
                categories={categories}
                initialData={{
                  ...selectedItem,
                  restaurant_id: restaurantId
                }}
                onSubmit={handleUpdateItem}
                isSubmitting={updateItemMutation.isPending}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu item "{selectedItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} disabled={deleteItemMutation.isPending}>
              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemDialogs;
