
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menu';

export const useItemMutations = (usingTestData: boolean = false) => {
  const queryClient = useQueryClient();
  
  const createItemMutation = useMutation({
    mutationFn: async (item: Partial<MenuItem>): Promise<MenuItem> => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item creation", item);
        // Create a fake ID for test mode
        return Promise.resolve({
          ...item,
          id: `new-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: item.name || "Default Name", // Ensure required properties are present
          price: item.price || 0,
          category_id: item.category_id || "",
          restaurant_id: item.restaurant_id || ""
        } as MenuItem);
      }
      return await createMenuItem(item);
    },
    onSuccess: (data: MenuItem) => {
      // Invalidate and refetch menuItems query
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // If using test data, we need to manually update the cache
      if (usingTestData && data.restaurant_id) {
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
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MenuItem> }): Promise<MenuItem> => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item update", { id, updates });
        return Promise.resolve({
          id,
          ...updates,
          updated_at: new Date().toISOString(),
          name: updates.name || "Default Name", // Ensure required properties are present
          price: updates.price !== undefined ? updates.price : 0,
          category_id: updates.category_id || "",
          restaurant_id: updates.restaurant_id || ""
        } as MenuItem);
      }
      return await updateMenuItem(id, updates);
    },
    onSuccess: (data: MenuItem) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // If using test data, manually update the cache
      if (usingTestData && data.restaurant_id) {
        const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', data.restaurant_id]) || [];
        const updatedItems = currentItems.map(item => 
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(['menuItems', data.restaurant_id], updatedItems);
      }
      
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
    mutationFn: async (id: string): Promise<boolean> => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item deletion", id);
        return Promise.resolve(true);
      }
      return await deleteMenuItem(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // If using test data, manually update the cache for all restaurant IDs
      if (usingTestData) {
        // Get all query keys related to menuItems
        const queryCache = queryClient.getQueryCache();
        const menuItemsQueries = queryCache.findAll(['menuItems']);
        
        menuItemsQueries.forEach(query => {
          const queryKey = query.queryKey;
          if (Array.isArray(queryKey) && queryKey.length > 1) {
            const restaurantId = queryKey[1];
            const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', restaurantId]) || [];
            const filteredItems = currentItems.filter(item => item.id !== deletedId);
            queryClient.setQueryData(['menuItems', restaurantId], filteredItems);
          }
        });
      }
      
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
