
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
      setQrData(data);
      setIsScanning(false);
    }
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err);
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    qrData,
    error,
    startScanning,
    stopScanning,
    handleScan,
    handleError
  };
}
