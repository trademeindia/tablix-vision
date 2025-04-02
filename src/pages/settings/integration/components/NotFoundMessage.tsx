
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundMessage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/settings/integrations')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Integrations
      </Button>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Integration not found. It may have been deleted or disconnected.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotFoundMessage;
