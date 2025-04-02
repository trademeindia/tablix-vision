
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface QRCodeDisplayProps {
  qrValue: string;
  size: string;
  tableNumber: string;
  onDownload: () => void;
  onShare: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrValue,
  size,
  tableNumber,
  onDownload,
  onShare
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
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </>
  );
};

export default QRCodeDisplay;
