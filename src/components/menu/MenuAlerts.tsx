
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

  // Analyze error to provide more specific guidance
  const getErrorDetails = (error: Error | null) => {
    if (!error) return null;
    
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        icon: <Wifi className="h-4 w-4" />,
        title: "Network Connection Issue",
        description: "There appears to be a problem with your internet connection. Check your connection and ensure you can access the internet.",
        action: "Try refreshing the page once your connection is restored."
      };
    } else if (message.includes('permission') || message.includes('security policy')) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        title: "Permission Error",
        description: "You don't have permission to access this data. This could be due to Row Level Security (RLS) policies in the database.",
        action: "Contact your administrator to check your permissions, or continue with test data."
      };
    } else if (message.includes('database') || message.includes('sql')) {
      return {
        icon: <Database className="h-4 w-4" />,
        title: "Database Error",
        description: "There was an issue connecting to the database or processing your request.",
        action: "The application will use test data for now. Contact support if this persists."
      };
    } else {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        title: "Error Loading Data",
        description: "An unexpected error occurred while loading data.",
        action: "The application will automatically retry loading the data."
      };
    }
  };

  const errorDetails = getErrorDetails(categoriesError || itemsError);

  return (
    <>
      {(categoriesError || itemsError) && errorDetails && (
        <Alert variant="destructive" className="mb-6">
          {errorDetails.icon}
          <AlertTitle>{errorDetails.title}</AlertTitle>
          <AlertDescription>
            <p>{errorDetails.description}</p>
            <p className="text-sm mt-1">{errorDetails.action}</p>
            {(categoriesError || itemsError) && (
              <p className="text-xs mt-2 text-gray-600">
                Technical details: {(categoriesError || itemsError)?.message}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {categoriesCount === 0 && !isCategoriesLoading && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
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
