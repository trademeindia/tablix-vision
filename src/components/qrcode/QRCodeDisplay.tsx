
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Download, Share2, Copy } from 'lucide-react';

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
    <>
      <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white rounded-md">
        <QRCodeSVG 
          id="qr-code-svg"
          value={qrValue}
          size={parseInt(size)}
          level="H"
          includeMargin={true}
        />
        <p className="mt-2 text-sm text-slate-500">
          Table {tableNumber}
        </p>
      </div>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="default" onClick={handleTest}>
          <Copy className="mr-2 h-4 w-4" />
          Test QR Code
        </Button>
      </CardFooter>
    </>
  );
};

export default QRCodeDisplay;
