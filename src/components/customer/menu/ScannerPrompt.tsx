
import React from 'react';
import { Camera, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerPromptProps {
  startScanning: () => void;
}

const ScannerPrompt: React.FC<ScannerPromptProps> = ({ startScanning }) => {
  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
        <Camera className="h-12 w-12 text-slate-400" />
      </div>
      
      <Button 
        onClick={startScanning} 
        size="lg" 
        className="w-full"
      >
        <Camera className="mr-2 h-5 w-5" />
        Start Camera to Scan
      </Button>
      
      <div className="text-sm text-center text-slate-500 space-y-4 mt-4">
        <p>
          This will open your camera to scan the QR code on your restaurant table
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center text-xs">
            <div className="rounded-full bg-blue-100 p-2 mb-2">
              <QrCode className="h-4 w-4 text-blue-500" />
            </div>
            <span>Scan code</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <div className="rounded-full bg-blue-100 p-2 mb-2">
              <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span>View menu</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <div className="rounded-full bg-blue-100 p-2 mb-2">
              <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span>Place order</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPrompt;
