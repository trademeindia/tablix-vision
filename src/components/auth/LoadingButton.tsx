
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

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
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
