
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info, Wifi, Database } from 'lucide-react';
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

  // Always show this as a demo message rather than an error
  if (categoriesCount === 0 && !isCategoriesLoading) {
    return (
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Welcome to the demo</AlertTitle>
        <AlertDescription>
          <p>You can create categories and add menu items to see the full functionality.</p>
          <Button 
            variant="link" 
            onClick={onAddCategory} 
            className="p-0 h-auto text-blue-600 ml-1"
          >
            Create your first category now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default MenuAlerts;
