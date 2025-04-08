
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const QRScannerInitializing: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center p-4">
      <RefreshCw className="h-8 w-8 text-white animate-spin mb-2" />
      <p className="text-white text-center">Initializing camera...</p>
      <Progress value={45} className="w-48 mt-2" />
    </div>
  );
};

export default QRScannerInitializing;
