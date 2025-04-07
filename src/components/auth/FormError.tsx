
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string | null;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start gap-2 animate-fade-in">
      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default FormError;
