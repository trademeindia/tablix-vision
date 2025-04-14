
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface TestDataAlertProps {
  isVisible: boolean;
}

const TestDataAlert: React.FC<TestDataAlertProps> = ({ isVisible }) => {
  const [shown, setShown] = useState(false);
  
  useEffect(() => {
    // Check if we've already shown this alert in this session
    const hasShownAlert = sessionStorage.getItem('demoAlertShown') === 'true';
    
    // Only show the alert if it's visible and hasn't been shown yet
    if (isVisible && !hasShownAlert) {
      setShown(true);
      // Mark as shown for this session
      sessionStorage.setItem('demoAlertShown', 'true');
    }
  }, [isVisible]);
  
  // Don't render anything if we shouldn't show the alert
  if (!shown) return null;
  
  return (
    <Alert className="my-4 border-blue-200 bg-blue-50">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Demo Mode Active</AlertTitle>
      <AlertDescription>
        You're viewing a demonstration with demo data. All features (adding to cart, ordering, etc.) are fully operational.
      </AlertDescription>
    </Alert>
  );
};

export default TestDataAlert;
