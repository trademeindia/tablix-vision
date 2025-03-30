
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const MissingInfoView: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Missing table or restaurant information. 
            Please scan the QR code again.
          </p>
          <Button 
            className="w-full mt-4" 
            onClick={() => navigate('/customer-menu')}
          >
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissingInfoView;
