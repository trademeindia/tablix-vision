
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQrGenerator } from '@/hooks/use-qr-generator';
import QRCodeForm from './QRCodeForm';
import QRCodeDisplay from './QRCodeDisplay';

interface QRCodeGeneratorProps {
  restaurantId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ restaurantId }) => {
  const {
    tableNumber,
    setTableNumber,
    size,
    setSize,
    seats,
    setSeats,
    isGenerating,
    qrValue,
    isSaving,
    handleGenerate,
    handleDownload,
    handleShare,
    handleTest
  } = useQrGenerator(restaurantId);

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
          setTableNumber={setTableNumber}
          size={size}
          setSize={setSize}
          seats={seats}
          setSeats={setSeats}
          restaurantId={restaurantId}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          isSaving={isSaving}
        />
        
        {qrValue && (
          <QRCodeDisplay
            qrValue={qrValue}
            size={size}
            tableNumber={tableNumber}
            handleDownload={handleDownload}
            handleShare={handleShare}
            handleTest={handleTest}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
