
import React from 'react';
import { AlertTriangle, Film, Box } from 'lucide-react';

interface TestDataAlertProps {
  isVisible: boolean;
}

const TestDataAlert: React.FC<TestDataAlertProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 p-3 text-sm text-amber-800 z-50 flex items-center justify-center">
      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="font-semibold">
          Demo Menu
        </span>
        <span className="text-xs">
          Check out animated <Film className="h-3 w-3 inline mx-1" /> GIFs and interactive <Box className="h-3 w-3 inline mx-1" /> 3D models in the "Showcase Items" category!
        </span>
      </div>
    </div>
  );
};

export default TestDataAlert;
