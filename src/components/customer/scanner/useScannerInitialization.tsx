
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from '@/hooks/use-toast';

interface UseScannerInitializationProps {
  onScan: (data: string) => void;
}

interface UseScannerInitializationReturn {
  scannerRef: React.RefObject<Html5Qrcode | null>;
  containerRef: React.RefObject<HTMLDivElement>;
  hasCameraError: boolean;
  cameraSwitched: boolean;
  initializing: boolean;
  cameraMode: 'environment' | 'user';
  setCameraSwitched: React.Dispatch<React.SetStateAction<boolean>>;
  setCameraMode: React.Dispatch<React.SetStateAction<'environment' | 'user'>>;
  setInitializing: React.Dispatch<React.SetStateAction<boolean>>;
  setHasCameraError: React.Dispatch<React.SetStateAction<boolean>>;
  startScanner: (mode: 'environment' | 'user') => void;
}

export const useScannerInitialization = ({ onScan }: UseScannerInitializationProps): UseScannerInitializationReturn => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [cameraSwitched, setCameraSwitched] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [cameraMode, setCameraMode] = useState<'environment' | 'user'>('environment');

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
            // console.log('QR Code scanned successfully:', decodedText);
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
          // console.log('QR scan error (normal during scanning):', errorMessage);
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
          // console.log(`Trying with ${newMode} camera instead`);
          startScanner(newMode);
        }
      });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'qr-reader';
    containerRef.current.innerHTML = `<div id="${containerId}" style="width: 100%;"></div>`;

    // Create scanner instance
    scannerRef.current = new Html5Qrcode(containerId);

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

  return {
    scannerRef,
    containerRef,
    hasCameraError,
    cameraSwitched,
    initializing,
    cameraMode,
    setCameraSwitched,
    setCameraMode,
    setInitializing,
    setHasCameraError,
    startScanner
  };
};
