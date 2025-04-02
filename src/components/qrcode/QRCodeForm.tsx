
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface QRCodeFormProps {
  tableNumber: string;
  size: string;
  isGenerating: boolean;
  onTableNumberChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenerate: () => void;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({
  tableNumber,
  size,
  isGenerating,
  onTableNumberChange,
  onSizeChange,
  onGenerate
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="table-number" className="text-sm font-medium">
          Table Number
        </label>
        <Input
          id="table-number"
          type="number"
          min="1"
          value={tableNumber}
          onChange={(e) => onTableNumberChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="qr-size" className="text-sm font-medium">
          QR Code Size
        </label>
        <Select value={size} onValueChange={onSizeChange}>
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
        onClick={onGenerate} 
        disabled={isGenerating} 
        className="w-full"
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate QR Code
      </Button>
    </div>
  );
};

export default QRCodeForm;
