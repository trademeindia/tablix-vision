
import React, { useRef } from 'react';

interface QRScannerViewportProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const QRScannerViewport: React.FC<QRScannerViewportProps> = ({ containerRef }) => {
  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden"
      />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-60 h-60 border-2 border-white rounded-lg opacity-50"></div>
      </div>
    </div>
  );
};

export default QRScannerViewport;
