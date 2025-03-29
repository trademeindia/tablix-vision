
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  restaurantId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ restaurantId }) => {
  const [tableNumber, setTableNumber] = useState('1');
  const [size, setSize] = useState('256');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const value = `https://restaurant.app/menu/${restaurantId}?table=${tableNumber}`;
      setQrValue(value);
      setIsGenerating(false);
    }, 800);
  };

  const handleDownload = () => {
    // This would be implemented to download the QR code as an image
    console.log("Downloading QR code...");
  };

  const handleShare = () => {
    // This would implement sharing functionality
    console.log("Sharing QR code...");
  };

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
