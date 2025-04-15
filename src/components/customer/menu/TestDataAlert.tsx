
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TestDataAlertProps {
  isVisible: boolean;
}

const TestDataAlert: React.FC<TestDataAlertProps> = ({ isVisible }) => {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    // Only show the alert if it's visible and hasn't been dismissed yet
    const hasBeenDismissed = localStorage.getItem('testDataAlertDismissed') === 'true';
    setShowAlert(isVisible && !hasBeenDismissed);
    
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      if (isVisible) {
        setShowAlert(false);
        localStorage.setItem('testDataAlertDismissed', 'true');
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [isVisible]);
  
  if (!showAlert) return null;

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Demo Mode</AlertTitle>
      <AlertDescription className="text-blue-600">
        You're viewing example menu data. In a real app, this would show actual restaurant menu items.
      </AlertDescription>
    </Alert>
  );
};

export default TestDataAlert;
