
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

export const useItemMutations = (usingTestData: boolean = false) => {
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: (data: Partial<MenuItem>) => {
      // Fix: Ensure media_type is properly set as a string value rather than an object
      const formattedData = {
        ...data,
        media_type: typeof data.media_type === 'object' ? 
          (data.media_type as any)?.value || 'image' : 
          data.media_type || 'image'
      };

      console.log("Creating menu item with data:", formattedData);
      
      if (usingTestData) {
        console.log("Would create item with test data:", formattedData);
        return Promise.resolve({
          ...formattedData,
          id: `00000000-0000-0000-0000-${Math.floor(Math.random() * 1000000).toString().padStart(9, '0')}`,
          created_at: new Date().toISOString()
        } as MenuItem);
      }
      return createMenuItem(formattedData);
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
      // Fix: Ensure media_type is properly set as a string value rather than an object
      const formattedUpdates = {
        ...updates,
        media_type: typeof updates.media_type === 'object' ? 
          (updates.media_type as any)?.value || 'image' : 
          updates.media_type || 'image'
      };

      console.log("Updating menu item with data:", id, formattedUpdates);
      
      if (usingTestData) {
        console.log("Would update item with test data:", id, formattedUpdates);
        return Promise.resolve({
          ...formattedUpdates,
          id,
          updated_at: new Date().toISOString()
        } as MenuItem);
      }
      return updateMenuItem(id, formattedUpdates);
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
