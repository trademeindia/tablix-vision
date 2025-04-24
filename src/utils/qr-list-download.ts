
import { toast } from '@/hooks/use-toast';

/**
 * Downloads a QR code from a list as a PNG image
 * @param tableNumber The table number for the QR code
 */
export const downloadQRCodeFromList = (tableNumber: number): void => {
  // Get the SVG element
  const svgElement = document.getElementById(`qr-code-svg-${tableNumber}`);
  if (!svgElement) {
    toast({
      title: "Download Failed",
      description: "Could not find the QR code element.",
      variant: "destructive",
    });
    return;
  }
  
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const sizeNum = 256;
    canvas.width = sizeNum;
    canvas.height = sizeNum;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svgElement);
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
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  } catch (error) {
    console.error('Error downloading QR code:', error);
    toast({
      title: "Download Failed",
      description: "There was an error downloading the QR code.",
      variant: "destructive",
    });
  }
};
