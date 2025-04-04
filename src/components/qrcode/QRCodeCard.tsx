
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Copy, Trash } from 'lucide-react';

interface QRCodeCardProps {
  id: string;
  tableNumber: number;
  qrCodeUrl: string;
  seats: number;
  status: string;
  onDownload: (qrValue: string, tableNumber: number) => void;
  onShare: (qrValue: string, tableNumber: number) => void;
  onTest: (qrValue: string) => void;
  onDelete: (tableId: string) => void;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  id,
  tableNumber,
  qrCodeUrl,
  seats,
  status,
  onDownload,
  onShare,
  onTest,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG
              id={`qr-code-svg-${tableNumber}`}
              value={qrCodeUrl}
              size={160}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center">
            <p className="font-medium text-lg">Table {tableNumber}</p>
            <p className="text-sm text-slate-500">{seats} seats · {status}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload(qrCodeUrl, tableNumber)}
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onShare(qrCodeUrl, tableNumber)}
            >
              <Share2 className="mr-1 h-3.5 w-3.5" />
              Share
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onTest(qrCodeUrl)}
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Test
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(id)}
            >
              <Trash className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeCard;
