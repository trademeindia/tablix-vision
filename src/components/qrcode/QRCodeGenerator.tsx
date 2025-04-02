
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QRCodeForm from './QRCodeForm';
import QRCodeDisplay from './QRCodeDisplay';
import { useQRGenerator } from '@/hooks/qrcode/use-qr-generator';

interface QRCodeGeneratorProps {
  restaurantId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ restaurantId }) => {
  const {
    tableNumber,
    setTableNumber,
    size,
    setSize,
    isGenerating,
    qrValue,
    handleGenerate,
    handleDownload,
    handleShare
  } = useQRGenerator(restaurantId);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
        <CardDescription>
          Create a unique QR code for each table in your restaurant
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <QRCodeForm
          tableNumber={tableNumber}
          size={size}
          isGenerating={isGenerating}
          onTableNumberChange={setTableNumber}
          onSizeChange={setSize}
          onGenerate={handleGenerate}
        />
        
        {qrValue && (
          <QRCodeDisplay
            qrValue={qrValue}
            size={size}
            tableNumber={tableNumber}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
