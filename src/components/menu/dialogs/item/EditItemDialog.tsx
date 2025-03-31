
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';

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
  
  const handleUpdateItem = async (data: Partial<MenuItem>) => {
    if (selectedItem) {
      updateItemMutation.mutate({ 
        id: selectedItem.id, 
        updates: data 
      }, {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItem(null);
        }
      });
    }
  };
  
  const handleCloseDialog = (open: boolean) => {
    setIsOpen(open);
    if (!open) setSelectedItem(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update this menu item's information.
          </DialogDescription>
        </DialogHeader>
        {selectedItem && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
