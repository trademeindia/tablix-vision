
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuAlertsProps {
  categoriesError: Error | null;
  itemsError: Error | null;
  categoriesCount: number;
  isCategoriesLoading: boolean;
  onAddCategory: () => void;
}

const MenuAlerts: React.FC<MenuAlertsProps> = ({
  categoriesError,
  itemsError,
  categoriesCount,
  isCategoriesLoading,
  onAddCategory
}) => {
  if (!categoriesError && !itemsError && (categoriesCount > 0 || isCategoriesLoading)) {
    return null;
  }

  return (
    <>
      {(categoriesError || itemsError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {categoriesError ? 'Failed to load categories' : 'Failed to load menu items'}. The application will automatically retry.
          </AlertDescription>
        </Alert>
      )}
      
      {categoriesCount === 0 && !isCategoriesLoading && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No categories found</AlertTitle>
          <AlertDescription>
            You need to create at least one category before adding menu items.
            <Button 
              variant="link" 
              onClick={onAddCategory} 
              className="p-0 h-auto text-blue-500 ml-1"
            >
              Create a category now
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default MenuAlerts;
