
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  restaurantId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ restaurantId }) => {
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
      // Use a format that the customer app can parse
      const baseUrl = window.location.origin;
      // Updated to use the correct route path 'customer-menu' instead of 'customer/menu'
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
        <CardDescription>
          Create a unique QR code for each table in your restaurant
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="table-number" className="text-sm font-medium">
            Table Number
          </label>
          <Input
            id="table-number"
            type="number"
            min="1"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="qr-size" className="text-sm font-medium">
            QR Code Size
          </label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="qr-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">Small (128x128)</SelectItem>
              <SelectItem value="256">Medium (256x256)</SelectItem>
              <SelectItem value="512">Large (512x512)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating} 
          className="w-full"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate QR Code
        </Button>
        
        {qrValue && (
          <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white rounded-md">
            <QRCodeSVG 
              id="qr-code-svg"
              value={qrValue}
              size={parseInt(size)}
              level="H"
              includeMargin={true}
            />
            <p className="mt-2 text-sm text-slate-500">
              Table {tableNumber}
            </p>
          </div>
        )}
      </CardContent>
      
      {qrValue && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QRCodeGenerator;
