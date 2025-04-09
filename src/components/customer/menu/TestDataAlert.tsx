
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TestDataAlertProps {
  isVisible: boolean;
}

const TestDataAlert: React.FC<TestDataAlertProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 p-2 text-sm text-amber-800 z-50 flex items-center justify-center">
      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
      <span>
        You're viewing a demo menu with sample items. Explore animated GIFs and 3D models in the "Showcase Items" category!
      </span>
    </div>
  );
};

export default TestDataAlert;
