
import { useState, useCallback } from 'react';

export function useQRCode() {
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setError(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const handleScan = useCallback((data: string) => {
    if (data) {
      console.log('QR data received:', data);
      setQrData(data);
      setIsScanning(false);
    }
  }, []);

  const handleError = useCallback((err: Error) => {
    console.error('QR Scanning Error:', err);
    setError(err);
    setIsScanning(false);
  }, []);

  // Reset QR data
  const resetQrData = useCallback(() => {
    setQrData(null);
  }, []);

  return {
    isScanning,
    qrData,
    error,
    startScanning,
    stopScanning,
    handleScan,
    handleError,
    resetQrData
  };
}
