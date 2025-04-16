
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Scan, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DemoQRCode: React.FC = () => {
  // Generate a demo URL for a sample restaurant menu with 3D items
  const demoUrl = `${window.location.origin}/customer/menu?restaurant=demo-restaurant-id&table=demo-table`;
  
  const handleDownload = () => {
    // Get the SVG element
    const svg = document.getElementById('demo-qr-code-svg');
    if (!svg) return;
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const size = 256;
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
        a.download = `menu360-demo-qr.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        
        toast({
          title: "Demo QR Code Downloaded",
          description: "The demo QR code has been saved to your device.",
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

  const handleTestScan = () => {
    window.open(demoUrl, '_blank');
    
    toast({
      title: "Opening Demo Menu",
      description: "The demo menu is opening in a new tab.",
    });
  };
  
  return (
    <Card className="overflow-hidden border-2 border-blue-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Badge className="w-fit mb-2 bg-blue-500">Demo</Badge>
        <CardTitle>Sample 3D Menu QR Code</CardTitle>
        <CardDescription>
          Scan this QR code to experience the Menu360 3D menu features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="bg-white p-3 rounded-lg border shadow-sm mb-4">
          <QRCodeSVG
            id="demo-qr-code-svg"
            value={demoUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="text-sm text-center text-slate-600 max-w-[250px] mb-2">
          This demo QR code will show you how customers view your interactive 3D menu
        </p>
      </CardContent>
      
      <CardFooter className="bg-slate-50 flex flex-wrap justify-center gap-2 p-4">
        <Button variant="outline" onClick={handleDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="default" onClick={handleTestScan} className="flex-1">
          <ExternalLink className="mr-2 h-4 w-4" />
          Test Scan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemoQRCode;
