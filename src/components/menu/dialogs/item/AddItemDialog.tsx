
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';
import { toast } from '@/hooks/use-toast';
import { ensureDemoRestaurantExists } from '@/services/menu/demoSetup';

interface AddItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
  restaurantId: string;
  onRefreshCategories?: () => void;
  usingTestData?: boolean;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  setIsOpen,
  categories,
  restaurantId,
  onRefreshCategories,
  usingTestData = false
}) => {
  const { createItemMutation } = useItemMutations(usingTestData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ensure the demo restaurant exists when the component mounts
  useEffect(() => {
    const setupDemoRestaurant = async () => {
      try {
        // Only run this in demo/test mode
        if (usingTestData || !restaurantId) {
          await ensureDemoRestaurantExists();
        }
      } catch (error) {
        console.error("Failed to setup demo restaurant:", error);
      }
    };
    
    setupDemoRestaurant();
  }, [usingTestData, restaurantId]);
  
  const handleAddItem = async (data: Partial<MenuItem>) => {
    try {
      // Prevent further processing if already submitting
      if (isSubmitting) {
        console.log("Already submitting, preventing duplicate submission");
        return;
      }
      
      setIsSubmitting(true);
      
      // Ensure restaurant_id is included in the data
      // If restaurantId is empty, use a default ID
      const defaultRestaurantId = "00000000-0000-0000-0000-000000000000";
      const itemData = {
        ...data,
        restaurant_id: restaurantId || defaultRestaurantId
      };
      
      console.log("Using restaurant ID:", itemData.restaurant_id);
      
      // Validate required fields
      if (!itemData.name?.trim()) {
        toast({
          title: "Validation error",
          description: "Item name is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!itemData.price || isNaN(Number(itemData.price)) || Number(itemData.price) <= 0) {
        toast({
          title: "Validation error",
          description: "Valid price is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!itemData.category_id) {
        toast({
          title: "Validation error", 
          description: "Please select a category",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Creating menu item with data:", itemData);
      
      await createItemMutation.mutateAsync(itemData);
      
      // After successful creation, close the dialog
      setIsOpen(false);
      
      // Refresh categories and items after creating a new item
      if (onRefreshCategories) {
        console.log("Refreshing menu data after item creation");
        onRefreshCategories();
      }
      
      toast({
        title: "Menu item created",
        description: `${itemData.name} has been added to your menu`,
      });
    } catch (error) {
      console.error("Error in handleAddItem:", error);
      toast({
        title: "Failed to add menu item",
        description: "Please try again or check the console for more details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Create a new item for your menu.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <ItemForm 
            categories={categories}
            onSubmit={handleAddItem}
            isSubmitting={isSubmitting || createItemMutation.isPending}
            onRefreshCategories={onRefreshCategories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
