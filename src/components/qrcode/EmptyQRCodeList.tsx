
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface EmptyQRCodeListProps {
  onRefresh: () => void;
}

const EmptyQRCodeList: React.FC<EmptyQRCodeListProps> = ({ onRefresh }) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <p className="text-center text-slate-500 mb-4">
          You haven't generated any QR codes yet. Create one using the "Generate QR Codes" tab.
        </p>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyQRCodeList;
