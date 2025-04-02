
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export function useQRGenerator(restaurantId: string) {
  const [tableNumber, setTableNumber] = useState('1');
  const [size, setSize] = useState('256');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const handleGenerate = useCallback(() => {
    if (!tableNumber.trim()) {
      toast({
        title: "Missing Table Number",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create a properly formatted URL for QR code scanning
      const baseUrl = window.location.origin;
      const value = `${baseUrl}/customer-menu?restaurant=${restaurantId}&table=${tableNumber}`;
      
      console.log("Generated QR code with URL:", value);
      
      setQrValue(value);
      setIsGenerating(false);
      
      toast({
        title: "QR Code Generated",
        description: `QR code for Table ${tableNumber} has been generated.`,
      });
    }, 800);
  }, [restaurantId, tableNumber]);

  const handleDownload = useCallback(() => {
    if (!qrValue) return;
    
    // Get the SVG element
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const sizeNum = parseInt(size);
      canvas.width = sizeNum;
      canvas.height = sizeNum;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        
        // Create download link
        const a = document.createElement('a');
        a.download = `qr-code-table-${tableNumber}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        
        toast({
          title: "QR Code Downloaded",
          description: `QR code for Table ${tableNumber} has been saved.`,
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the QR code.",
        variant: "destructive",
      });
    }
  }, [qrValue, size, tableNumber]);

  const handleShare = useCallback(() => {
    if (!qrValue) return;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: `QR Code for Table ${tableNumber}`,
        text: `Scan this QR code to access the menu for table ${tableNumber}`,
        url: qrValue,
      })
      .then(() => {
        toast({
          title: "QR Code Shared",
          description: "The QR code has been shared successfully.",
        });
      })
      .catch((error) => {
        console.error('Error sharing QR code:', error);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(qrValue)
        .then(() => {
          toast({
            title: "QR Code Link Copied",
            description: "The QR code link has been copied to your clipboard.",
          });
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast({
            title: "Copy Failed",
            description: "There was an error copying the link to clipboard.",
            variant: "destructive",
          });
        });
    }
  }, [qrValue, tableNumber]);

  return {
    tableNumber,
    setTableNumber,
    size,
    setSize,
    isGenerating,
    qrValue,
    handleGenerate,
    handleDownload,
    handleShare
  };
}
