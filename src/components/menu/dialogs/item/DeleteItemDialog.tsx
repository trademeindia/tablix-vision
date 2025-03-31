
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MenuItem } from '@/types/menu';
import { useItemMutations } from '@/hooks/menu/use-item-mutations';

interface DeleteItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  usingTestData?: boolean;
}

const DeleteItemDialog: React.FC<DeleteItemDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
  usingTestData = false
}) => {
  const { deleteItemMutation } = useItemMutations(usingTestData);
  
  const handleDeleteItem = async () => {
    if (selectedItem) {
      deleteItemMutation.mutate(selectedItem.id, {
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
    <AlertDialog open={isOpen} onOpenChange={handleCloseDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the menu item "{selectedItem?.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteItem} disabled={deleteItemMutation.isPending}>
            {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteItemDialog;
