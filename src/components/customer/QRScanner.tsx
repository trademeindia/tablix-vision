
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Camera, CameraOff, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [cameraSwitched, setCameraSwitched] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [cameraMode, setCameraMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'qr-reader';
    containerRef.current.innerHTML = `<div id="${containerId}" style="width: 100%;"></div>`;

    // Create scanner instance
    scannerRef.current = new Html5Qrcode(containerId);

    const startScanner = (mode: 'environment' | 'user') => {
      setInitializing(true);
      if (!scannerRef.current) return;
      
      scannerRef.current
        .start(
          { facingMode: mode },
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
        .then(() => {
          setInitializing(false);
          setCameraMode(mode);
        })
        .catch((err) => {
          console.error(`Failed to start scanner with ${mode} camera`, err);
          
          // If we already tried switching cameras, then show an error
          if (cameraSwitched) {
            setHasCameraError(true);
            setInitializing(false);
            toast({
              title: "Camera Error",
              description: "Could not access your camera. Please check permissions.",
              variant: "destructive"
            });
          } else {
            // Try the other camera
            setCameraSwitched(true);
            const newMode = mode === 'environment' ? 'user' : 'environment';
            console.log(`Trying with ${newMode} camera instead`);
            startScanner(newMode);
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
    
    setInitializing(true);
    
    // Stop current scanner
    scannerRef.current.stop().then(() => {
      // Start with the other camera
      const newMode = cameraMode === 'environment' ? 'user' : 'environment';
      console.log(`Switching to ${newMode} camera`);
      
      scannerRef.current?.start(
        { facingMode: newMode },
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
      )
      .then(() => {
        setInitializing(false);
        setCameraMode(newMode);
      })
      .catch(err => {
        console.error('Failed to start scanner after camera switch', err);
        setHasCameraError(true);
        setInitializing(false);
        toast({
          title: "Camera Error",
          description: "Could not access camera after switching. Please check permissions.",
          variant: "destructive"
        });
      });
    }).catch(err => {
      console.error('Error stopping scanner before camera switch', err);
      setInitializing(false);
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500">
              <XCircle className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={switchCamera}
            disabled={initializing || hasCameraError}
            className="ml-auto"
          >
            <Camera className="h-4 w-4 mr-2" />
            <span>{cameraMode === 'environment' ? 'Front' : 'Back'} Camera</span>
          </Button>
        </div>
        
        {initializing && (
          <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center p-4">
            <RefreshCw className="h-8 w-8 text-white animate-spin mb-2" />
            <p className="text-white text-center">Initializing camera...</p>
            <Progress value={45} className="w-48 mt-2" />
          </div>
        )}
        
        {hasCameraError ? (
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden flex flex-col items-center justify-center p-4">
            <CameraOff className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-center text-slate-700 mb-4">
              Could not access your camera. Please check your permissions and refresh the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={containerRef} 
              className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden"
            ></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-60 h-60 border-2 border-white rounded-lg opacity-50"></div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-center text-muted-foreground mt-4">
          Point your camera at the QR code on your table to access the menu
        </p>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
