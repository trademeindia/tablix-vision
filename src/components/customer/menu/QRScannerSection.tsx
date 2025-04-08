
import React from 'react';
import QRScanner from '@/components/customer/QRScanner';
import ScannerCard from './ScannerCard';
import ScannerPrompt from './ScannerPrompt';

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
  return (
    <ScannerCard isScanning={isScanning}>
      {isScanning ? (
        <QRScanner 
          onScan={(data) => {
            if (data) {
              console.log('QR Code scanned:', data);
              handleScan(data);
            }
          }}
          onClose={() => window.location.href = '/'}
        />
      ) : (
        <ScannerPrompt startScanning={startScanning} />
      )}
    </ScannerCard>
  );
};

export default QRScannerSection;
