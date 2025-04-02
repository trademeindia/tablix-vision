
import React from 'react';
import { Button } from '@/components/ui/button';

interface DebugPanelProps {
  debugInfo: {
    scannedQrData: string | null;
    parsedTableId: string | null;
    parsedRestaurantId: string | null;
    locationSearch: string;
    locationPathname: string;
    usingTestData?: boolean;
    categoriesCount?: number;
    itemsCount?: number;
    orderItemsCount?: number;
  };
}

const DebugPanel: React.FC<DebugPanelProps> = ({ debugInfo }) => {
  if (process.env.NODE_ENV !== 'development' && !new URLSearchParams(window.location.search).has('debug')) {
    return null;
  }

  const createDebugModal = () => {
    const debugModal = document.createElement('div');
    debugModal.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;overflow:auto;padding:20px;">
        <div style="background:white;max-width:600px;margin:40px auto;padding:20px;border-radius:8px;">
          <h3 style="font-weight:bold;margin-bottom:10px;">Debug Info</h3>
          <pre style="background:#f1f1f1;padding:10px;overflow:auto;font-size:12px;">${JSON.stringify(debugInfo, null, 2)}</pre>
          <button style="background:#f1f1f1;padding:8px 16px;border-radius:4px;margin-top:10px;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(debugModal);
    debugModal.querySelector('button')?.addEventListener('click', () => {
      document.body.removeChild(debugModal);
    });
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white shadow-md"
        onClick={createDebugModal}
      >
        Debug
      </Button>
    </div>
  );
};

export default DebugPanel;
