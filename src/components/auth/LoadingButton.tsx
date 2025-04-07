
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const LoadingButton = ({
  isLoading = false,
  loadingText = "Loading...",
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
