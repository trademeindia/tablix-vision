
import React from 'react';
import { Button } from '@/components/ui/button';
import { CameraOff, RefreshCw } from 'lucide-react';

interface QRScannerErrorProps {
  onRetry: () => void;
}

const QRScannerError: React.FC<QRScannerErrorProps> = ({ onRetry }) => {
  return (
    <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden flex flex-col items-center justify-center p-4">
      <CameraOff className="h-12 w-12 text-slate-400 mb-4" />
      <p className="text-center text-slate-700 mb-4">
        Could not access your camera. Please check your permissions and refresh the page.
      </p>
      <Button onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default QRScannerError;
