
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;
  
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md bg-destructive/15 p-2 text-sm text-destructive", 
      className
    )}>
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
