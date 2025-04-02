
import React from 'react';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/customer/QRScanner';
import { useNavigate } from 'react-router-dom';

interface QRScannerSectionProps {
  isScanning: boolean;
  startScanning: () => void;
  handleScan: (data: string) => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({
  isScanning,
  startScanning,
  handleScan,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Scan Table QR Code</h1>
      {isScanning ? (
        <QRScanner 
          onScan={(data) => {
            if (data) {
              console.log('QR Code scanned:', data);
              handleScan(data);
            }
          }}
          onClose={() => navigate('/')}
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Button onClick={startScanning} size="lg">
            Scan QR Code
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Scan the QR code on your restaurant table to view the menu
          </p>
        </div>
      )}
    </div>
  );
};

export default QRScannerSection;
