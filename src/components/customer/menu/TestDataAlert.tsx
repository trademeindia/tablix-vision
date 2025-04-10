
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface TestDataAlertProps {
  isVisible: boolean;
}

const TestDataAlert: React.FC<TestDataAlertProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Alert className="my-4 border-blue-200 bg-blue-50">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Demo Mode</AlertTitle>
      <AlertDescription>
        You're viewing a demonstration. Add and edit menu items to see how the app works! All functions (adding to cart, ordering, etc.) are fully operational.
      </AlertDescription>
    </Alert>
  );
};

export default TestDataAlert;
