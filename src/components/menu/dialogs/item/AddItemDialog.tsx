
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';
import { toast } from '@/hooks/use-toast';

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
  
  const handleAddItem = async (data: Partial<MenuItem>) => {
    try {
      // Ensure restaurant_id is included in the data
      const itemData = {
        ...data,
        restaurant_id: restaurantId
      };
      
      console.log("Creating menu item with data:", itemData);
      
      await createItemMutation.mutateAsync(itemData);
      
      // Close dialog after successful creation
      setIsOpen(false);
      
      // Refresh categories and items after creating a new item
      if (onRefreshCategories) {
        console.log("Refreshing data after item creation");
        setTimeout(() => {
          onRefreshCategories();
        }, 300); // Add a small delay to ensure DB operations complete
      }
    } catch (error) {
      console.error("Error in handleAddItem:", error);
      toast({
        title: "Failed to add menu item",
        description: "Please try again or check the console for more details.",
        variant: "destructive",
      });
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
            isSubmitting={createItemMutation.isPending}
            onRefreshCategories={onRefreshCategories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
