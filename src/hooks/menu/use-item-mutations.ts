
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

// Helper to provide better error messages
const getErrorMessage = (error: any): string => {
  // Extract the most meaningful error message
  if (error?.message) {
    const message = error.message;
    
    // Handle specific error cases
    if (message.includes('duplicate key')) {
      return "An item with this name already exists. Please use a different name.";
    } else if (message.includes('not found')) {
      return "The menu category couldn't be found. It may have been deleted.";
    } else if (message.includes('violates row level security')) {
      return "You don't have permission to perform this action. Please contact an administrator.";
    } else if (message.includes('network')) {
      return "Network error. Please check your internet connection and try again.";
    } else if (message.includes('timeout')) {
      return "The request timed out. Please try again later.";
    } else if (message.includes('required')) {
      return "Please fill in all required fields: name, price, and category.";
    }
    
    return message;
  }
  
  return "An unexpected error occurred. Please try again.";
};

export interface MediaTypeOption {
  value: string;
  label: string;
}

export const useItemMutations = (usingTestData: boolean = false) => {
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      // Fix: Ensure media_type is properly set as a string value rather than an object
      const formattedData = {
        ...data,
        media_type: typeof data.media_type === 'object' ? 
          ((data.media_type as unknown as MediaTypeOption)?.value || 'image') : 
          (data.media_type || 'image')
      };

      console.log("Creating menu item with data:", formattedData);
      
      // Validate required fields
      if (!formattedData.name) {
        throw new Error("Item name is required");
      }
      
      if (formattedData.price === undefined || formattedData.price === null) {
        throw new Error("Item price is required");
      }
      
      if (!formattedData.category_id) {
        throw new Error("Please select a category");
      }
      
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
    onError: (error: any) => {
      console.error("Create item error:", error);
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Failed to create item",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => {
      // Fix: Ensure media_type is properly set as a string value rather than an object
      const formattedUpdates = {
        ...updates,
        media_type: typeof updates.media_type === 'object' ? 
          ((updates.media_type as unknown as MediaTypeOption)?.value || 'image') : 
          (updates.media_type || 'image')
      };

      console.log("Updating menu item with data:", id, formattedUpdates);
      
      // Validate required fields
      if (formattedUpdates.name === '') {
        throw new Error("Item name cannot be empty");
      }
      
      if (formattedUpdates.price !== undefined && formattedUpdates.price < 0) {
        throw new Error("Price cannot be negative");
      }
      
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
    onError: (error: any) => {
      console.error("Update item error:", error);
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Failed to update item",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error("Item ID is required for deletion");
      }
      
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
    onError: (error: any) => {
      console.error("Delete item error:", error);
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Failed to delete item",
        description: errorMessage,
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
