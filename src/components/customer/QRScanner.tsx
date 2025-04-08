
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  QRScannerError,
  QRScannerHeader,
  QRScannerInitializing,
  QRScannerViewport,
  useScannerInitialization
} from './scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const {
    containerRef,
    hasCameraError,
    initializing,
    cameraMode,
    setInitializing,
    startScanner
  } = useScannerInitialization({ onScan });

  // Try switching camera if the user clicks the button
  const switchCamera = () => {
    setInitializing(true);
    const newMode = cameraMode === 'environment' ? 'user' : 'environment';
    startScanner(newMode);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-md">
      <CardContent className="p-4">
        <QRScannerHeader 
          onClose={onClose}
          onSwitchCamera={switchCamera}
          cameraMode={cameraMode}
          disabled={initializing || hasCameraError}
        />
        
        {initializing && <QRScannerInitializing />}
        
        {hasCameraError ? (
          <QRScannerError onRetry={() => window.location.reload()} />
        ) : (
          <QRScannerViewport containerRef={containerRef} />
        )}
        
        <p className="text-sm text-center text-muted-foreground mt-4">
          Point your camera at the QR code on your table to access the menu
        </p>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
