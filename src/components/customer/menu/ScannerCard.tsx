
import React from 'react';
import { QrCode, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScannerCardProps {
  isScanning: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ScannerCard: React.FC<ScannerCardProps> = ({
  isScanning,
  children,
  title = "Scan Restaurant QR Code",
  description = "Point your camera at the QR code on your table to view the menu"
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="absolute left-2 top-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex justify-center mb-2">
            <QrCode className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScannerCard;
