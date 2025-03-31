
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

interface StatusAlertProps {
  message: string;
  type: 'success' | 'error' | 'loading' | null;
  details?: string;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ message, type, details }) => {
  if (!message) return null;
  
  return (
    <Alert 
      variant={type === 'error' ? 'destructive' : 'default'} 
      className={`mb-4 ${type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}`}
    >
      {type === 'loading' && <Spinner size="sm" className="mr-2" />}
      {type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
      {type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
      <div>
        <AlertDescription>{message}</AlertDescription>
        {details && (
          <p className="text-xs mt-1 font-normal">{details}</p>
        )}
      </div>
    </Alert>
  );
};

export default StatusAlert;
