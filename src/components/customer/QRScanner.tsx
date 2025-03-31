
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'qr-reader';
    containerRef.current.innerHTML = `<div id="${containerId}" style="width: 100%;"></div>`;

    // Create scanner instance
    scannerRef.current = new Html5Qrcode(containerId);

    // Start scanner with rear camera
    scannerRef.current
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan
          if (decodedText) {
            console.log('QR Code scanned:', decodedText);
            toast({
              title: "QR Code Scanned",
              description: "Loading menu...",
            });
            
            if (scannerRef.current) {
              scannerRef.current.stop().catch(err => {
                console.error('Failed to stop scanner after successful scan', err);
              });
            }
            
            onScan(decodedText);
          }
        },
        (errorMessage) => {
          // On error - don't show these to the user
          console.log('QR scan error (normal during scanning):', errorMessage);
        }
      )
      .catch((err) => {
        console.error('Failed to start scanner', err);
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive"
        });
      });

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Failed to stop scanner on unmount', err));
      }
    };
  }, [onScan]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {onClose && (
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div 
          ref={containerRef} 
          className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden"
        ></div>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Point your camera at the QR code on your table
        </p>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
