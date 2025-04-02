
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Camera, CameraOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [cameraSwitched, setCameraSwitched] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'qr-reader';
    containerRef.current.innerHTML = `<div id="${containerId}" style="width: 100%;"></div>`;

    // Create scanner instance
    scannerRef.current = new Html5Qrcode(containerId);

    // Start scanner with rear camera first
    const startScanner = (facingMode: string) => {
      if (!scannerRef.current) return;
      
      scannerRef.current
        .start(
          { facingMode },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // On successful scan
            if (decodedText) {
              console.log('QR Code scanned successfully:', decodedText);
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
          console.error(`Failed to start scanner with ${facingMode} camera`, err);
          
          // If we already tried switching cameras, then show an error
          if (cameraSwitched) {
            setHasCameraError(true);
            toast({
              title: "Camera Error",
              description: "Could not access your camera. Please check permissions.",
              variant: "destructive"
            });
          } else {
            // Try the other camera
            setCameraSwitched(true);
            const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
            console.log(`Trying with ${newFacingMode} camera instead`);
            startScanner(newFacingMode);
          }
        });
    };

    // Start with environment (rear) camera
    startScanner('environment');

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Failed to stop scanner on unmount', err));
      }
    };
  }, [onScan]);

  // Try switching camera if the user clicks the button
  const switchCamera = () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    
    // Stop current scanner
    scannerRef.current.stop().then(() => {
      setCameraSwitched(prev => !prev);
      
      // Start with the other camera
      const facingMode = cameraSwitched ? 'environment' : 'user';
      console.log(`Switching to ${facingMode} camera`);
      
      scannerRef.current?.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (decodedText) {
            console.log('QR Code scanned successfully after camera switch:', decodedText);
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
          // Ignore errors during scanning
          console.log('QR scan error (normal during scanning):', errorMessage);
        }
      ).catch(err => {
        console.error('Failed to start scanner after camera switch', err);
        setHasCameraError(true);
        toast({
          title: "Camera Error",
          description: "Could not access camera after switching. Please check permissions.",
          variant: "destructive"
        });
      });
    }).catch(err => {
      console.error('Error stopping scanner before camera switch', err);
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={switchCamera}>
            <Camera className="h-5 w-5" />
            <span className="ml-2">Switch Camera</span>
          </Button>
        </div>
        
        {hasCameraError ? (
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden flex flex-col items-center justify-center p-4">
            <CameraOff className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-center text-slate-700 mb-4">
              Could not access your camera. Please check your permissions and refresh the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div 
            ref={containerRef} 
            className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden"
          ></div>
        )}
        
        <p className="text-sm text-center text-muted-foreground mt-4">
          Point your camera at the QR code on your table
        </p>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
