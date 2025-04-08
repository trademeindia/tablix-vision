
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
        // Simulate network delay for realistic testing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a fake ID for test mode
        return {
          ...item,
          id: `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: item.name || "Default Name", // Ensure required properties are present
          price: item.price || 0,
          category_id: item.category_id || "",
          restaurant_id: item.restaurant_id || ""
        } as MenuItem;
      }
      
      console.log("Creating menu item with Supabase:", item);
      return await createMenuItem(item);
    },
    onSuccess: (data: MenuItem) => {
      console.log("Menu item created successfully:", data);
      
      // More specific cache invalidation
      if (data.restaurant_id) {
        // Invalidate specific restaurant menu items
        queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
      } else {
        // Fallback to invalidate all menu items
        queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      }
      
      // Update cache manually for test data
      if (usingTestData && data.restaurant_id) {
        const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', data.restaurant_id]) || [];
        console.log("Current items in cache before update:", currentItems.length);
        queryClient.setQueryData(['menuItems', data.restaurant_id], [...currentItems, data]);
        console.log("Updated cache with new item:", data.id);
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
        
        // Simulate network delay for realistic testing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get current items to merge with updates
        const currentItems = queryClient.getQueryData<MenuItem[]>(
          ['menuItems', updates.restaurant_id]
        ) || [];
        
        const existingItem = currentItems.find(item => item.id === id) || {
          id,
          name: "Default Item",
          price: 0,
          category_id: "",
          restaurant_id: updates.restaurant_id,
          created_at: new Date().toISOString()
        };
        
        // Merge existing item with updates
        return {
          ...existingItem,
          ...updates,
          updated_at: new Date().toISOString()
        } as MenuItem;
      }
      
      console.log("Updating menu item with Supabase:", id, updates);
      return await updateMenuItem(id, updates);
    },
    onSuccess: (data: MenuItem) => {
      console.log("Menu item updated successfully:", data);
      
      // More specific cache invalidation
      if (data.restaurant_id) {
        // Update cache manually for test data
        if (usingTestData) {
          const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', data.restaurant_id]) || [];
          console.log("Current items in cache before update:", currentItems.length);
          const updatedItems = currentItems.map(item => 
            item.id === data.id ? data : item
          );
          queryClient.setQueryData(['menuItems', data.restaurant_id], updatedItems);
          console.log("Updated cache with modified item:", data.id);
        } else {
          // For real data, invalidate the cache
          queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ['menuItems'] });
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
        // Simulate network delay for realistic testing
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      console.log("Deleting menu item with Supabase:", id);
      return await deleteMenuItem(id);
    },
    onSuccess: (_, deletedId) => {
      console.log("Menu item deleted successfully:", deletedId);
      
      // Invalidate all menu item queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // If using test data, manually update the cache for all restaurant IDs
      if (usingTestData) {
        // Get all query keys related to menuItems
        const queryCache = queryClient.getQueryCache();
        const menuItemsQueries = queryCache.findAll({
          queryKey: ['menuItems']
        });
        
        menuItemsQueries.forEach(query => {
          const queryKey = query.queryKey;
          if (Array.isArray(queryKey) && queryKey.length > 1) {
            const restaurantId = queryKey[1];
            const currentItems = queryClient.getQueryData<MenuItem[]>(['menuItems', restaurantId]) || [];
            console.log(`Found restaurant ${restaurantId} with ${currentItems.length} items`);
            const filteredItems = currentItems.filter(item => item.id !== deletedId);
            queryClient.setQueryData(['menuItems', restaurantId], filteredItems);
            console.log(`Updated cache for restaurant ${restaurantId}, removed item ${deletedId}`);
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
