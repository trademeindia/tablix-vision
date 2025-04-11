
import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';
import { toast } from '@/hooks/use-toast';

interface EditItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  categories: MenuCategory[];
  restaurantId: string;
  onRefreshCategories?: () => void;
  usingTestData?: boolean;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
  categories,
  restaurantId,
  onRefreshCategories,
  usingTestData = false
}) => {
  const { updateItemMutation } = useItemMutations(usingTestData);
  
  const handleUpdateItem = useCallback(async (data: Partial<MenuItem>) => {
    if (!selectedItem) {
      console.error("No item selected for update");
      return;
    }
    
    try {
      // Ensure restaurant_id is included in the updates
      const updateData = {
        ...data,
        restaurant_id: restaurantId
      };
      
      console.log("Updating menu item with data:", { id: selectedItem.id, updates: updateData });
      
      await updateItemMutation.mutateAsync({ 
        id: selectedItem.id, 
        updates: updateData 
      });
      
      // Close dialog and clean up selection after successful update
      setIsOpen(false);
      setSelectedItem(null);
      
      // Refresh data after update
      if (onRefreshCategories) {
        console.log("Refreshing data after item update");
        onRefreshCategories();
      }
    } catch (error) {
      console.error("Error in handleUpdateItem:", error);
      toast({
        title: "Failed to update menu item",
        description: "Please try again or check the console for more details.",
        variant: "destructive",
      });
    }
  }, [selectedItem, restaurantId, updateItemMutation, setIsOpen, setSelectedItem, onRefreshCategories]);
  
  const handleCloseDialog = useCallback((open: boolean) => {
    if (!open) {
      // Add a small delay before clearing selected item to prevent UI issues
      setTimeout(() => {
        setSelectedItem(null);
      }, 100);
    }
    setIsOpen(open);
  }, [setIsOpen, setSelectedItem]);
  
  // Don't render anything if no item is selected
  if (!isOpen || !selectedItem) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update this menu item's information.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <ItemForm 
            categories={categories}
            initialData={{
              ...selectedItem,
              restaurant_id: restaurantId
            }}
            onSubmit={handleUpdateItem}
            isSubmitting={updateItemMutation.isPending}
            onRefreshCategories={onRefreshCategories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(EditItemDialog);
