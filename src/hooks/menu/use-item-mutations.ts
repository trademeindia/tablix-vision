
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

export const useItemMutations = (usingTestData: boolean = false) => {
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => {
      if (usingTestData) {
        console.log("Would create item with test data:", data);
        return Promise.resolve({
          ...data,
          id: `00000000-0000-0000-0000-${Math.floor(Math.random() * 1000000).toString().padStart(9, '0')}`,
          created_at: new Date().toISOString()
        } as MenuItem);
      }
      return createMenuItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
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
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => {
      if (usingTestData) {
        console.log("Would update item with test data:", id, updates);
        return Promise.resolve({
          ...updates,
          id,
          updated_at: new Date().toISOString()
        } as MenuItem);
      }
      return updateMenuItem(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
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
    mutationFn: (id: string) => {
      if (usingTestData) {
        console.log("Would delete item with test data:", id);
        return Promise.resolve(true);
      }
      return deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
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

  return {
    createItemMutation,
    updateItemMutation,
    deleteItemMutation
  };
};
