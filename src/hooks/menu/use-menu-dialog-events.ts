
import { useEffect } from 'react';

interface UseMenuDialogEventsProps {
  setIsAddCategoryOpen: (open: boolean) => void;
  setIsAddItemOpen: (open: boolean) => void;
}

export const useMenuDialogEvents = ({
  setIsAddCategoryOpen,
  setIsAddItemOpen
}: UseMenuDialogEventsProps) => {
  // Set up event listeners for dialog actions
  useEffect(() => {
    const handleMenuAdd = (event: CustomEvent) => {
      const { type } = event.detail;
      if (type === 'category') {
        setIsAddCategoryOpen(true);
      } else {
        setIsAddItemOpen(true);
      }
    };

    // Add event listener
    document.addEventListener('menu:add', handleMenuAdd as EventListener);
    
    // Cleanup
    return () => {
      document.removeEventListener('menu:add', handleMenuAdd as EventListener);
    };
  }, [setIsAddCategoryOpen, setIsAddItemOpen]);
};
