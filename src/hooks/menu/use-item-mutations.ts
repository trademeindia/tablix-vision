
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
        queryClient.setQueryData(['menuItems', data.restaurant_id], [...currentItems, data]);
      }
    },
    onError: (error: any) => {
      console.error("Error creating menu item:", error);
      toast({
        title: "Failed to create menu item",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async ({id, updates}: {id: string, updates: Partial<MenuItem>}): Promise<MenuItem> => {
      if (usingTestData) {
        console.log("Using test data mode - simulating item update", id, updates);
        // Simulate network delay for realistic testing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a fake updated item for test mode
        return {
          ...updates,
          id,
          updated_at: new Date().toISOString(),
        } as MenuItem;
      }
      
      console.log("Updating menu item with Supabase:", id, updates);
      return await updateMenuItem(id, updates);
    },
    onSuccess: (data: MenuItem) => {
      console.log("Menu item updated successfully:", data);
      
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
        const updatedItems = currentItems.map(item => 
          item.id === data.id ? { ...item, ...data } : item
        );
        queryClient.setQueryData(['menuItems', data.restaurant_id], updatedItems);
      }
    },
    onError: (error: any) => {
      console.error("Error updating menu item:", error);
      toast({
        title: "Failed to update menu item",
        description: error.message || "Please try again later",
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
    onSuccess: (data, variables, context) => {
      const id = variables; // The id passed to deleteItemMutation.mutate()
      console.log("Menu item deleted successfully:", id);
      
      // Refresh all menu items queries since we don't know the restaurant_id here
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // For test data, remove the item from all related caches
      if (usingTestData) {
        // Get all query keys
        const queryCache = queryClient.getQueryCache();
        const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
        
        // Find all menuItems queries and update them
        queryKeys.forEach(key => {
          if (Array.isArray(key) && key[0] === 'menuItems') {
            const items = queryClient.getQueryData<MenuItem[]>(key) || [];
            const filteredItems = items.filter(item => item.id !== id);
            queryClient.setQueryData(key, filteredItems);
          }
        });
      }
    },
    onError: (error: any) => {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Failed to delete menu item",
        description: error.message || "Please try again later",
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
