
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Download, Share2, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QRCodeDisplayProps {
  qrValue: string;
  size: string;
  tableNumber: string;
  handleDownload: () => void;
  handleShare: () => void;
  handleTest: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrValue,
  size,
  tableNumber,
  handleDownload,
  handleShare,
  handleTest
}) => {
  if (!qrValue) return null;
  
  return (
    <div className="mt-6 space-y-4">
      <Separator />
      
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-md border border-slate-200 shadow-sm">
        <QRCodeSVG 
          id="qr-code-svg"
          value={qrValue}
          size={parseInt(size)}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
        <p className="mt-4 text-sm font-medium text-center">
          Table {tableNumber}
        </p>
        <p className="text-xs text-slate-500 text-center">
          Scan with a smartphone camera to access the menu
        </p>
      </div>
      
      <CardFooter className="flex flex-wrap gap-2 justify-center px-0">
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="flex-1 sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button 
          variant="default" 
          onClick={handleTest}
          className="w-full sm:w-auto"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Test QR Code
        </Button>
      </CardFooter>
    </div>
  );
};

export default QRCodeDisplay;
