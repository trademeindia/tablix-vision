
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menu';

export const useItemMutations = (usingTestData: boolean = false) => {
  const queryClient = useQueryClient();
  
  const createItemMutation = useMutation({
    mutationFn: (item: Partial<MenuItem>) => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item creation", item);
        // Create a fake ID for test mode
        return Promise.resolve({
          ...item,
          id: `new-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }) as any;
      }
      return createMenuItem(item);
    },
    onSuccess: (data) => {
      // Invalidate and refetch menuItems query
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // If using test data, we need to manually update the cache
      if (usingTestData) {
        const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', data.restaurant_id]) || [];
        queryClient.setQueryData(['menuItems', data.restaurant_id], [...currentItems, data]);
      }
      
      toast({
        title: "Item created",
        description: "The menu item has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating item:", error);
      toast({
        title: "Failed to create menu item",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item update", { id, updates });
        return Promise.resolve({
          id,
          ...updates,
          updated_at: new Date().toISOString()
        }) as any;
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
      console.error("Error updating item:", error);
      toast({
        title: "Failed to update menu item",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item deletion", id);
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
      console.error("Error deleting item:", error);
      toast({
        title: "Failed to delete menu item",
        description: error instanceof Error ? error.message : "Unknown error occurred",
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
