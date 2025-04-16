
import { toast } from '@/hooks/use-toast';

/**
 * Downloads a QR code as a PNG image
 * @param svgElementId The ID of the SVG element to download
 * @param size The size of the output PNG
 * @param filename The filename for the downloaded PNG
 */
export const downloadQRCode = (svgElementId: string, size: number, filename: string): void => {
  // Get the SVG element
  const svg = document.getElementById(svgElementId);
  if (!svg) {
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
    canvas.width = size;
    canvas.height = size;
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
      a.download = filename;
      a.href = canvas.toDataURL('image/png');
      a.click();
      
      toast({
        title: "QR Code Downloaded",
        description: `QR code has been saved as ${filename}.`,
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
