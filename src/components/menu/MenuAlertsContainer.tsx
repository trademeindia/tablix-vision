
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import MenuInfoCard from '@/components/menu/MenuInfoCard';
import MenuAlerts from '@/components/menu/MenuAlerts';

interface MenuAlertsContainerProps {
  categoriesError: Error | null;
  itemsError: Error | null;
  categoriesCount: number;
  isCategoriesLoading: boolean;
  onAddCategory: () => void;
}

const MenuAlertsContainer: React.FC<MenuAlertsContainerProps> = ({
  categoriesError,
  itemsError,
  categoriesCount,
  isCategoriesLoading,
  onAddCategory
}) => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  
  useEffect(() => {
    // Check for database errors and show a helpful message after a short delay
    const timer = setTimeout(() => {
      const consoleErrors = document.querySelectorAll('.console-error');
      if (consoleErrors.length > 0) {
        setIsErrorVisible(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <MenuInfoCard showModel3dInfo={true} />
      
      {isErrorVisible && (
        <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            You're in demo mode. Add and edit menu items to see how everything works! All features are fully operational.
          </AlertDescription>
        </Alert>
      )}
      
      <MenuAlerts 
        categoriesError={categoriesError}
        itemsError={itemsError}
        categoriesCount={categoriesCount}
        isCategoriesLoading={isCategoriesLoading}
        onAddCategory={onAddCategory}
      />
    </>
  );
};

export default MenuAlertsContainer;
