
import { useEffect, useRef } from 'react';

interface UseDialogAutoRefreshProps {
  isAddItemOpen: boolean;
  isEditItemOpen: boolean;
  isDeleteItemOpen: boolean;
  isAddCategoryOpen: boolean;
  isEditCategoryOpen: boolean;
  isDeleteCategoryOpen: boolean;
  onRefresh: () => void;
}

export const useDialogAutoRefresh = ({
  isAddItemOpen,
  isEditItemOpen,
  isDeleteItemOpen,
  isAddCategoryOpen,
  isEditCategoryOpen,
  isDeleteCategoryOpen,
  onRefresh
}: UseDialogAutoRefreshProps) => {
  const dialogCloseTimestamp = useRef<number | null>(null);

  // Automatically refresh data after dialog closes, with debounce
  useEffect(() => {
    // Only refresh when a dialog has just been closed
    const dialogsClosed = !isAddItemOpen && !isEditItemOpen && !isDeleteItemOpen && 
                          !isAddCategoryOpen && !isEditCategoryOpen && !isDeleteCategoryOpen;
    const currentTime = Date.now();
    
    if (dialogsClosed) {
      // Set close timestamp when a dialog closes
      if (dialogCloseTimestamp.current === null) {
        dialogCloseTimestamp.current = currentTime;
        
        console.log("Dialog closed, refreshing data");
        // Use setTimeout to prevent excessive refreshing
        const refreshTimeout = setTimeout(() => {
          onRefresh();
          dialogCloseTimestamp.current = null;
        }, 200);
        
        return () => clearTimeout(refreshTimeout);
      }
    } else {
      // Reset timestamp when dialog is open
      dialogCloseTimestamp.current = null;
    }
  }, [
    isAddItemOpen, 
    isEditItemOpen, 
    isDeleteItemOpen, 
    isAddCategoryOpen, 
    isEditCategoryOpen, 
    isDeleteCategoryOpen, 
    onRefresh
  ]);
};
