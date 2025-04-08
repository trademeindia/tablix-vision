
import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Camera } from 'lucide-react';

interface QRScannerHeaderProps {
  onClose?: () => void;
  onSwitchCamera: () => void;
  cameraMode: 'environment' | 'user';
  disabled: boolean;
}

const QRScannerHeader: React.FC<QRScannerHeaderProps> = ({ 
  onClose, 
  onSwitchCamera, 
  cameraMode, 
  disabled 
}) => {
  return (
    <div className="flex justify-between items-center mb-3">
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500">
          <XCircle className="h-5 w-5" />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSwitchCamera}
        disabled={disabled}
        className="ml-auto"
      >
        <Camera className="h-4 w-4 mr-2" />
        <span>{cameraMode === 'environment' ? 'Front' : 'Back'} Camera</span>
      </Button>
    </div>
  );
};

export default QRScannerHeader;
