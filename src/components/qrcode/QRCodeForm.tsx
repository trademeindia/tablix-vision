
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, QrCode } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QRCodeFormProps {
  tableNumber: string;
  setTableNumber: (value: string) => void;
  size: string;
  setSize: (value: string) => void;
  seats: string;
  setSeats: (value: string) => void;
  restaurantId: string;
  handleGenerate: () => void;
  isGenerating: boolean;
  isSaving: boolean;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({
  tableNumber,
  setTableNumber,
  size,
  setSize,
  seats,
  setSeats,
  restaurantId,
  handleGenerate,
  isGenerating,
  isSaving
}) => {
  const isValidTableNumber = !isNaN(Number(tableNumber)) && Number(tableNumber) > 0;
  const isValidSeats = !isNaN(Number(seats)) && Number(seats) > 0;
  const isButtonDisabled = isGenerating || !restaurantId || isSaving || !isValidTableNumber || !isValidSeats;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="table-number" className="text-sm font-medium">
          Table Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="table-number"
          type="number"
          min="1"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className={`w-full ${!isValidTableNumber && tableNumber !== '' ? 'border-red-500' : ''}`}
          placeholder="e.g. 1, 2, 3"
        />
        {!isValidTableNumber && tableNumber !== '' && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid table number</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seats" className="text-sm font-medium">
          Number of Seats <span className="text-red-500">*</span>
        </Label>
        <Input
          id="seats"
          type="number"
          min="1"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          className={`w-full ${!isValidSeats && seats !== '' ? 'border-red-500' : ''}`}
          placeholder="e.g. 2, 4, 6"
        />
        {!isValidSeats && seats !== '' && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid number of seats</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="qr-size" className="text-sm font-medium">
          QR Code Size
        </Label>
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
      
      <div className="space-y-2">
        <Label htmlFor="restaurant-id" className="text-sm font-medium">
          Restaurant ID
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Input
                  id="restaurant-id"
                  type="text"
                  value={restaurantId}
                  readOnly
                  className="w-full bg-gray-100 pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <QrCode className="h-4 w-4" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your restaurant's unique identifier</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground">
          Used to link QR codes to your restaurant
        </p>
      </div>
      
      <Button 
        onClick={handleGenerate} 
        disabled={isButtonDisabled} 
        className="w-full"
      >
        {(isGenerating || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate QR Code
      </Button>
      {isButtonDisabled && !isGenerating && !isSaving && !restaurantId && (
        <p className="text-xs text-center text-amber-500">
          You need to create a restaurant first to generate real QR codes
        </p>
      )}
    </div>
  );
};

export default QRCodeForm;
