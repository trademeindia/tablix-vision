
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ItemForm from '@/components/menu/ItemForm';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';

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
    createItemMutation.mutate({
      ...data,
      restaurant_id: restaurantId
    }, {
      onSuccess: () => setIsOpen(false)
    });
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
